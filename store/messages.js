import {db} from '../Firebase'
import {createCurrentChatId, addNewMembers} from './chats'
import {addNewChatroom} from './user'
import {getLangValue, getLangKey} from '../utils/translate'
import {GOOGLE_API_KEY} from 'react-native-dotenv'

const chatsRef = db.ref('chats')

// ---------- ACTION TYPES ---------- //
export const GET_MESSAGES = 'GET_MESSAGES'
export const APPEND_MESSAGE = 'APPEND_MESSAGE'
const SEND_MESSAGE_ERROR = 'SEND_MESSAGE_ERROR'

// ---------- ACTION CREATORS ---------- //

export const getMessages = (messages) => ({type: GET_MESSAGES, messages})
const appendMessage = (message) => ({type: APPEND_MESSAGE, message})
// const sendMessageError = (message) => ({ type: ADD_CONTACT_ERROR, message });

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
    original: message.translations.original,
  }
  const userLanguage = getState().user.language

  // if the message was sent by the user it will not be translated
  if (message.senderId !== getState().firebase.auth.uid) {
    // check if translation to user's language exists
    if (message.translations[userLanguage]) {
      newMessage.text = message.translations[userLanguage]
      newMessage.translatedFrom =
        message.translations[userLanguage] !== message.message
          ? message.detectedSource
          : false
      dispatch(appendMessage(newMessage))
    } else {
      // translate the original message to the language of the user
      fetch(
        `https://translation.googleapis.com/language/translate/v2?q=${
          message.message
        }&target=${getLangKey(userLanguage)}&key=${GOOGLE_API_KEY}`
      )
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          // add the translation to the db
          db.ref(
            `messages/${
              getState().chats.currentChat.id
            }/${messageId}/translations`
          ).update({
            [userLanguage]: data.data.translations[0].translatedText,
          })

          // update detected source language if it does not exist
          if (!message.detectedSource) {
            db.ref(
              `messages/${getState().chats.currentChat.id}/${property}`
            ).update({
              detectedSource: getLangValue(
                data.data.translations[0].detectedSourceLanguage
              ),
            })
          }

          // add the translation to the new message
          newMessage.text = data.data.translations[0].translatedText
          newMessage.translatedFrom =
            data.data.translations[0].translatedText !== message.message
              ? getLangValue(data.data.translations[0].detectedSourceLanguage)
              : false

          dispatch(appendMessage(newMessage))
        })
    }
  } else {
    newMessage.text = message.translations.original
    dispatch(appendMessage(newMessage))
  }
}

// SEND NEW MESSAGE
export const postMessage = (text) => async (dispatch) => {
  try {
    const {
      uid,
      displayName,
      contactId,
      contactName,
      currChatId,
      message,
      timestamp,
    } = text
    const members = {
      [uid]: displayName,
      [contactId]: contactName,
    }

    let chatId = currChatId
    // if chatId doesn't exist, create id, new chatroom and add members
    if (!chatId) {
      chatId = await dispatch(createCurrentChatId())
      await dispatch(addNewChatroom(chatId, uid))
      await dispatch(addNewChatroom(chatId, contactId))
      await dispatch(addNewMembers(chatId, members))
    }

    // update chats node
    chatsRef
      .child(chatId)
      .update({
        lastMessage: message,
        senderId: uid,
        timestamp,
      })
      .then(() => {
        // update messages node
        db.ref(`messages/${chatId}`)
          .push()
          .set({
            message,
            senderId: uid,
            senderName: displayName,
            timestamp,
            translations: {
              original: message,
            },
          })
        dispatch(notify(contactId, displayName, message))
      })
      .catch((err) =>
        console.log('Error posting message to chats and messages', err)
      )
  } catch (err) {
    console.error('Error adding msg to db: ', err)
  }
}

export const notify = (contactId, senderName, message) => async () => {
  try {
    const snapshot = await db
      .ref('/users/' + contactId + '/notifications/token')
      .once('value')

    const receiverToken = snapshot.val()
    // console.log("RECEIVERTOKEN --- INSIDE NOTIFY", receiverToken);
    // console.log("CONTACT ID --- INSIDE NOTIFY", contactId);
    // console.log("SNAPSHOT --- INSIDE NOTIFY", snapshot);

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
  sendMessageError: '',
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
    case SEND_MESSAGE_ERROR:
      return {...state, sendMessageError: action.message}
    default:
      return state
  }
}

export default messagesReducer
