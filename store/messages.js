import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

import { db, storage } from "../Firebase";
import { addNewChatroom, addNewMembers, createCurrentChatId } from ".";
import { getLangValue, getLangKey } from "../utils";

const chatsRef = db.ref("chats");
const audioRef = storage.ref().child("audio");

// ---------- ACTION TYPES ---------- //
export const GET_MESSAGES = "GET_MESSAGES";
export const ADD_MESSAGE = "ADD_MESSAGE";
const SEND_MESSAGE_ERROR = "SEND_MESSAGE_ERROR";

// ---------- ACTION CREATORS ---------- //

export const getMessages = messages => ({ type: GET_MESSAGES, messages });
const addMessage = message => ({ type: ADD_MESSAGE, message });
// const sendMessageError = (message) => ({ type: ADD_CONTACT_ERROR, message });

// ---------- THUNK CREATORS ---------- //

// GET MESSAGES FOR CURRENT CHAT
export const fetchMessages = () => (dispatch, getState) => {
  // query for all messages for the current chat, and add listener on child_added for new messages
  if (getState().chats.currentChat) {
    db.ref(`messages/${getState().chats.currentChat.id}`).on("child_added", function(snapshot) {
      // format a message object compatible with GiftedChat, message text not added yet
      const newMessage = {
        _id: snapshot.key,
        user: {
          _id: snapshot.val().senderId,
          name: snapshot.val().senderName
        },
        createdAt: snapshot.val().timestamp,
        original: snapshot.val().translations ? snapshot.val().translations.original : "",
        messageType: snapshot.val().messageType
      };

      const userLanguage = getState().user.language;

      // if the message was sent by the user it will not be translated
      // check if message type is text
      if (snapshot.val().senderId !== getState().firebase.auth.uid && messageType === "message") {
        // check if translation to user's language exists
        if (snapshot.val().translations[userLanguage]) {
          newMessage.text = snapshot.val().translations[userLanguage];
          dispatch(addMessage(newMessage));
        } else {
          // translate the original message to the language of the user
          fetch(
            `https://translation.googleapis.com/language/translate/v2?q=${snapshot.val().message}&target=${getLangKey(
              userLanguage
            )}&key=AIzaSyBjkzKxFh39nYubNpXp72NkpG15_FSRWdg`
          )
            .then(response => {
              return response.json();
            })
            .then(data => {
              newMessage.text = data.data.translations[0].translatedText;
              newMessage.translatedFrom =
                data.data.translations[0].translatedText !== snapshot.val().message
                  ? getLangValue(data.data.translations[0].detectedSourceLanguage)
                  : false;

              dispatch(addMessage(newMessage));
            });
        }
      } else {
        // case: message file
        if (newMessage.messageType === "message") {
          newMessage.text = snapshot.val().translations.original;
          dispatch(addMessage(newMessage));
          // case: audio file
        } else if (newMessage.messageType === "audio") {
          FileSystem.downloadAsync(snapshot.val().audio.uri, FileSystem.documentDirectory + snapshot.val().audio.name)
            .then(audioObj => {
              console.log("AUDIO OBj", audioObj);
              return Audio.Sound.createAsync({ uri: audioObj.uri }, { isLooping: false });
            })
            .then(({ sound, status }) => {
              console.log("SOUND", sound);
              console.log("STATUS", status);
              newMessage.audio = status.uri;
              newMessage.sound = sound;
              console.log("FETCH MESSAGES DISPATCH NEW MESSAGE", newMessage);
              dispatch(addMessage(newMessage));
            });
        }
      }
    });
  }
};

// SEND NEW MESSAGE
export const postMessage = ({
  uid,
  displayName,
  contactId,
  contactName,
  currChatId,
  timestamp,
  message = "",
  audio = "",
  messageType
}) => async dispatch => {
  try {
    console.log("IN POST MESSAGE", uid, displayName, contactId, contactName, currChatId, timestamp, audio, messageType);
    const members = {
      [uid]: displayName,
      [contactId]: contactName
    };

    let chatId = currChatId;
    // if chatId doesn't exist, create id, new chatroom and add members
    if (!chatId) {
      chatId = await dispatch(createCurrentChatId());
      await dispatch(addNewChatroom(chatId, uid));
      await dispatch(addNewChatroom(chatId, contactId));
      await dispatch(addNewMembers(chatId, members));
    }

    // update chats node
    chatsRef
      .child(chatId)
      .update({
        lastMessage: uid + ": " + (message || "audio file"),
        senderId: uid,
        timestamp
      })
      .then(() => {
        // create message object to push to firebase
        let newMessage = {
          senderId: uid,
          senderName: displayName,
          timestamp,
          messageType
        };
        if (messageType === "message") {
          newMessage.translations = {
            original: message
          };
        } else if (messageType === "audio") {
          newMessage.audio = audio;
        }

        // update messages node
        db.ref(`messages/${chatId}`).push().set(newMessage);
        console.log("ADD MESSAGE DISPATCH NEW MESSAGE", newMessage);
        dispatch(notify(contactId, displayName, message));
      })
      .catch(err => console.log("Error posting message to chats and messages", err));
  } catch (err) {
    console.error("Error adding msg to db: ", err);
  }
};

// SEND AUDIO
export const postAudio = (file, text) => async dispatch => {
  try {
    let message = text;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", file.uri, true);
      xhr.send(null);
    });
    const fileRef = audioRef.child(file.name);
    const snapshot = await fileRef.put(blob);
    const fileRefUrl = await fileRef.getDownloadURL();
    console.log("FILE REF URL", fileRefUrl);
    file.uri = fileRefUrl;
    text.audio = file;
    console.log("POST AUDIO TEXT", text);
    dispatch(postMessage(text));
    blob.close();
  } catch (err) {
    console.log("Error uploading audio file: ", err);
  }
};

// NOTIFICATION
export const notify = (contactId, senderName, message) => async () => {
  try {
    const snapshot = await db.ref("/users/" + contactId + "/notifications/token").once("value");

    const receiverToken = snapshot.val();
    // console.log("RECEIVERTOKEN --- INSIDE NOTIFY", receiverToken);
    // console.log("CONTACT ID --- INSIDE NOTIFY", contactId);
    // console.log("SNAPSHOT --- INSIDE NOTIFY", snapshot);

    if (receiverToken) {
      const notification = {
        to: receiverToken,
        sound: "default",
        title: senderName,
        body: message,
        _displayInForeground: true
      };
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(notification)
      });
    }
  } catch (err) {
    console.error("Error sending notification: ", err);
  }
};
// ---------- INITIAL STATE ---------- //

const defaultMessages = {
  messages: [],
  sendMessageError: ""
};

// ---------- REDUCER ---------- //
const messagesReducer = (state = defaultMessages, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return { ...state, messages: action.messages };
    case ADD_MESSAGE:
      // eslint-disable-next-line no-case-declarations
      let insertIndex = -1;
      for (let i = 0; i < state.messages.length; i++) {
        if (state.messages[i].createdAt > action.message.createdAt) {
          insertIndex = i;
          break;
        }
      }
      if (insertIndex !== -1) {
        return {
          ...state,
          messages: state.messages
            .slice(0, insertIndex)
            .concat(action.message)
            .concat(state.messages.slice(insertIndex))
        };
      } else {
        return {
          ...state,
          messages: state.messages.concat(action.message)
        };
      }
    case SEND_MESSAGE_ERROR:
      return { ...state, sendMessageError: action.message };
    default:
      return state;
  }
};

export default messagesReducer;
