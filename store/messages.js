import React from "react";
import base64 from "base-64";

import firebase, { auth, db } from "../Firebase";
import { createCurrentChatId, addNewMember } from "./chats";
import { addNewChatroom } from "./user";
import { translateText, getLangKey } from "../utils/translate";
import { GOOGLE_API_KEY } from "react-native-dotenv";

const messagesRef = db.ref("messages");
const chatsRef = db.ref("chats");

// ---------- ACTION TYPES ---------- //
export const GET_MESSAGES = "GET_MESSAGES";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";

// ---------- ACTION CREATORS ---------- //

const getMessages = (messages) => ({ type: GET_MESSAGES, messages });
const addMessage = (message) => ({ type: ADD_MESSAGE, message });
const sendMessage = (message, user) => ({ type: SEND_MESSAGE, message });
const receiveMessage = (message) => ({ type: RECEIVE_MESSAGE, message });

// ---------- THUNK CREATORS ---------- //

// for current chat
export const fetchMessages = () => (dispatch, getState) => {
  // query for all messages for the current chat, and add listener on child_added for new messages
  if (getState().chats.currentChat) {
    db.ref(`messages/${getState().chats.currentChat.id}`).on(
      "child_added",
      function (snapshot) {
        // format a message object compatible with GiftedChat, message text not added yet
        const newMessage = {
          _id: snapshot.key,
          user: {
            _id: snapshot.val().senderId,
            name: snapshot.val().senderName,
          },
          createdAt: snapshot.val().timestamp,
        };

        console.log("USER LANGUAGE:", getState().firebase.auth.language);
        const userLanguage = "French";

        // if the message was sent by the user it will not be translated
        if (snapshot.val().senderId !== getState().firebase.auth.uid) {
          // check if translation to user's language exists
          if (snapshot.val().translations[userLanguage]) {
            newMessage.text = snapshot.val().translations[userLanguage];
            dispatch(addMessage(newMessage));
          } else {
            // translate the original message to the language of the user
            fetch(
              `https://translation.googleapis.com/language/translate/v2?q=${
                snapshot.val().message
              }&target=fr&key=AIzaSyBjkzKxFh39nYubNpXp72NkpG15_FSRWdg`
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                console.log(data);

                newMessage.text = data.data.translations[0].translatedText;
                dispatch(addMessage(newMessage));
              });
            //${getLangKey(userLanguage)}
          }
        } else {
          newMessage.text = snapshot.val().translations.original;
          dispatch(addMessage(newMessage));
        }
      }
    );
  }
};

export const postMessage = (text) => async (dispatch, getState) => {
  try {
    console.log("TEXT", text);
    const {
      uid,
      displayName,
      message,
      timestamp,
      contactId,
      contactName,
    } = text;
    const members = {
      uid: displayName,
      contactId: contactName,
    };
    const state = getState();
    let chatId = "";
    if (!state.chats.currentChat) {
      chatId = await dispatch(createCurrentChatId());
      await dispatch(addNewChatroom(chatId, uid));
      await dispatch(addNewChatroom(chatId, contactId));
      await dispatch(addNewMember(chatId, members));
    } else {
      chatId = state.chats.currentChat.id;
    }
    const currChatRef = db.ref(`messages/${chatId}`);
    chatsRef
      .child(chatId)
      .update({
        lastMessage: `${uid}: ${message}`,
        senderId: uid,
        timestamp,
      })
      .then(() => {
        currChatRef.push().set({
          message,
          senderId: uid,
          senderName: displayName,
          timestamp,
          translations: {
            original: message,
          },
        });
      })
      .then(() => {
        dispatch(fetchMessages());
        console.log("DISPATCHED ADD NEW MESSAGE!");
      })
      .catch((err) =>
        console.log("Error posting message to chats and messages", err)
      );
  } catch (err) {
    console.error("Error adding msg to db: ", err);
  }
};

export const subscribeToMessages = () => async (dispatch) => {
  try {
    messages.on("child_added", (data) => dispatch(receiveMessage(data.val())));
  } catch (err) {
    console.error("Error subscribing to messages: ", err);
  }
};

// ---------- INITIAL STATE ---------- //

const defaultMessages = { messages: [] };

// ---------- REDUCER ---------- //
const messagesReducer = (state = defaultMessages, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages;
    case ADD_MESSAGE:
      return {
        messages: state.messages
          .filter((msg) => msg._id !== action.message._id)
          .concat(action.message),
      };
    case SEND_MESSAGE:
      return { ...state };
    case RECEIVE_MESSAGE:
      return { messages: state.messages.concat(action.message) };
    default:
      return state;
  }
};

export default messagesReducer;
