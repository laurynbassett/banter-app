import React from "react";
import base64 from "base-64";

import firebase, { auth, db } from "../Firebase";
import { createCurrentChatId, addNewMember } from "./chats";
import { addNewChatroom } from "./user";

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
  console.log("CURRCHAT", getState().chats.currentChat);
  // query for all messages for the current chat, and add listener on child_added for new messages
  if (getState().chats.currentChat) {
    db.ref(`messages/${getState().chats.currentChat.id}`).on(
      "child_added",
      function (snapshot) {
        // format message object to be compatible GiftedChat
        const newMessage = {
          _id: snapshot.key,
          user: {
            _id: snapshot.val().senderId,
            name: snapshot.val().senderName,
          },
          text: snapshot.val().message,
          createdAt: snapshot.val().timestamp,
        };
        console.log("NEWMSG", newMessage);
        // add message to redux state
        dispatch(addMessage(newMessage));
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
        });
      })
      .then(() => {
        console.log("CONTACTID", contactId);

        db.ref("users/" + contactId + "/notifications/token")
          .once("value")
          .then((snapshot) => {
            const receiverToken = snapshot.val();
            const notification = {
              to: receiverToken,
              sound: "default",
              title: displayName,
              body: message,
              _displayInForeground: true,
            };
            fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(notification),
            });
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

export const notify = (chatroomId) => async (dispatch) => {
  try {
    // db.ref('/users/')
  } catch (err) {
    console.error("Error sending notification: ", err);
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
