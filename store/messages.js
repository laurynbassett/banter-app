import * as FileSystem from 'expo-file-system'

import {GOOGLE_API_KEY} from 'react-native-dotenv'
import {db, storage} from '../Firebase'
import {addNewChatroom, addNewMembers, createCurrentChatId} from '.'
import {getLangValue, getLangKey, getTranscription} from '../utils'

const chatsRef = db.ref('chats')
const audioRef = storage.ref().child('audio')

// ---------- ACTION TYPES ---------- //
export const GET_MESSAGES = 'GET_MESSAGES'
export const APPEND_MESSAGE = 'APPEND_MESSAGE'

// ---------- ACTION CREATORS ---------- //

export const getMessages = (messages) => ({type: GET_MESSAGES, messages})
const appendMessage = (message) => ({type: APPEND_MESSAGE, message})

// ---------- THUNK CREATORS ---------- //

// GET MESSAGES FOR CURRENT CHAT
export const fetchMessages = () => (dispatch, getState) => {
  // query 25 most recent messages for the current chat, and add listener on child_added for new messages
  if (getState().chats.currentChat) {
    db.ref(`messages/${getState().chats.currentChat.id}`)
      .orderByChild('timestamp')
      .limitToLast(25)
      .on('child_added', function (snapshot) {
        dispatch(addMessage(snapshot.val(), snapshot.key))
      })
  }
}

export const fetchEarlierMessages = () => (dispatch, getState) => {
  db.ref(`messages/${getState().chats.currentChat.id}`)
    .orderByChild('timestamp')
    .limitToLast(25)
    .endAt(getState().messages.messages[0].createdAt)
    .once('value', function (snapshot) {
      // get id of oldest message currently in state
      const endAtId = getState().messages.messages[0]._id
      // add each message to state
      for (const property in snapshot.val()) {
        if (property !== endAtId) {
          dispatch(addMessage(snapshot.val()[property], property))
        }
      }
    })
}

const addMessage = (message, messageId) => (dispatch, getState) => {
  // format a message object compatible with GiftedChat, message text not added yet
  const newMessage = {
    _id: messageId,
    user: {
      _id: message.senderId,
      name: message.senderName,
    },
    createdAt: message.timestamp,
    original: message.translations ? message.translations.original : '',
    messageType: message.messageType,
  }
  const userLanguage = getState().user.language
  // case: audio file

  // if the message was sent by the user it will not be translated
  if (message.senderId !== getState().firebase.auth.uid) {
    const msg =
      message.messageType === 'message'
        ? message.message
        : message.audio.transcript
    // check if translation to user's language exists
    if (message.translations[userLanguage]) {
      newMessage.translatedFrom =
        message.translations[userLanguage] !== msg
          ? message.detectedSource
          : false

      if (message.messageType === 'message') {
        newMessage.text = message.translations[userLanguage]
        dispatch(appendMessage(newMessage))
      } else {
        FileSystem.downloadAsync(
          message.audio.uri,
          FileSystem.documentDirectory + message.audio.name
        ).then((audioObj) => {
          newMessage.audio = audioObj.uri
          newMessage.transcript = message.audio.transcript
          dispatch(appendMessage(newMessage))
        })
      }
    } else {
      // translate the original message to the language of the user
      fetch(
        `https://translation.googleapis.com/language/translate/v2?q=${msg}&target=${getLangKey(
          userLanguage
        )}&key=${GOOGLE_API_KEY}`
      )
        .then((response) => {
          return response.json()
        })
        .then(({data}) => {
          // add the translation to the db
          db.ref(
            `messages/${
              getState().chats.currentChat.id
            }/${messageId}/translations`
          ).update({
            [userLanguage]: data.translations[0].translatedText,
          })

          // update detected source language if it does not exist
          if (!message.detectedSource) {
            db.ref(
              `messages/${getState().chats.currentChat.id}/${messageId}`
            ).update({
              detectedSource: getLangValue(
                data.translations[0].detectedSourceLanguage
              ),
            })
          }

          newMessage.translatedFrom =
            data.translations[0].translatedText !== msg
              ? getLangValue(data.translations[0].detectedSourceLanguage)
              : false

          // add the translation to the new message
          if (messageType === 'message') {
            newMessage.text = data.translations[0].translatedText
            dispatch(appendMessage(newMessage))
          } else {
            FileSystem.downloadAsync(
              message.audio.uri,
              FileSystem.documentDirectory + message.audio.name
            ).then((audioObj) => {
              newMessage.audio = audioObj.uri
              newMessage.transcript = message.audio.transcript
              dispatch(appendMessage(newMessage))
            })
          }
        })
    }
  } else {
    newMessage.text = message.translations.original
    // case: audio file
    if (newMessage.messageType === 'audio') {
      FileSystem.downloadAsync(
        message.audio.uri,
        FileSystem.documentDirectory + message.audio.name
      ).then((audioObj) => {
        newMessage.audio = audioObj.uri
        newMessage.transcript = message.audio.transcript
        dispatch(appendMessage(newMessage))
      })
    } else dispatch(appendMessage(newMessage))
  }
}

// SEND NEW MESSAGE
export const postMessage = (text) => async (dispatch, getState) => {
  try {
    const {
      uid,
      displayName,
      contacts,
      currChatId,
      timestamp,
      message = '',
      audio = '',
      messageType,
    } = text
    console.log('TEXT', text)
    const members = getState().chats.currentChat.members
    members[uid] = displayName

    let chatId = currChatId
    // if chatId doesn't exist, create id, new chatroom and add members
    if (!chatId) {
      chatId = await dispatch(createCurrentChatId())
      await dispatch(addNewChatroom(chatId, uid))
      contacts.forEach(
        async (contact) =>
          await dispatch(addNewChatroom(chatId, contact.contactId))
      )
      await dispatch(addNewMembers(chatId, members))
    }

    // update chats node
    chatsRef
      .child(chatId)
      .update({
        lastMessage:
          messageType === 'message'
            ? message
            : audio.transcript !== 'Transcription unavailable'
            ? audio.transcript
            : 'Voice note',
        senderId: uid,
        timestamp,
      })
      .then(() => {
        // create message object to push to firebase
        let newMessage = {
          senderId: uid,
          senderName: displayName,
          timestamp,
          messageType,
        }
        newMessage.translations = {
          original:
            messageType === 'message'
              ? message
              : audio.transcript !== 'Transcription unavailable'
              ? audio.transcript
              : 'Voice note',
        }
        if (messageType === 'audio') {
          newMessage.audio = audio
        }

        // update messages node
        db.ref(`messages/${chatId}`).push().set(newMessage)

        contacts.forEach(async (contact) => {
          const msg =
            message || audio.transcript !== 'Transcription unavailable'
              ? audio.transcript
              : 'Voice note'
          dispatch(notify(contact.contactId, displayName, msg))
        })

        // dispatch(notify(contactId, displayName, message))
      })
      .catch((err) =>
        console.log('Error posting message to chats and messages', err)
      )
  } catch (err) {
    console.error('Error adding msg to db: ', err)
  }
}

// SEND AUDIO
export const postAudio = (file, text) => async (dispatch) => {
  try {
    let message = text
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (err) {
        console.log('Error creating blob: ', err)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', file.uri, true)
      xhr.send(null)
    })
    const fileRef = audioRef.child(file.name)
    await fileRef.put(blob)
    const uri = await fileRef.getDownloadURL()
    file.transcript =
      (await getTranscription(file)) || 'Transcription unavailable'
    file.uri = uri
    text.audio = file
    dispatch(postMessage(text))
    blob.close()
  } catch (err) {
    console.log('Error uploading audio file: ', err)
  }
}

// NOTIFICATION
export const notify = (contactId, senderName, message) => async () => {
  try {
    const snapshot = await db
      .ref('/users/' + contactId + '/notifications/token')
      .once('value')
    const receiverToken = snapshot.val()

    if (receiverToken) {
      const notification = {
        to: receiverToken,
        sound: 'default',
        title: senderName,
        body: message,
        _displayInForeground: true,
      }
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      })
    }
  } catch (err) {
    console.error('Error sending notification: ', err)
  }
}
// ---------- INITIAL STATE ---------- //

const defaultMessages = {
  messages: [],
}

// ---------- REDUCER ---------- //
const messagesReducer = (state = defaultMessages, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {...state, messages: action.messages}
    case APPEND_MESSAGE:
      // eslint-disable-next-line no-case-declarations
      let insertIndex = -1
      for (let i = 0; i < state.messages.length; i++) {
        if (state.messages[i].createdAt > action.message.createdAt) {
          insertIndex = i
          break
        }
      }
      if (insertIndex !== -1) {
        return {
          ...state,
          messages: state.messages
            .slice(0, insertIndex)
            .concat(action.message)
            .concat(state.messages.slice(insertIndex)),
        }
      } else {
        return {
          ...state,
          messages: state.messages.concat(action.message),
        }
      }
    default:
      return state
  }
}

export default messagesReducer
