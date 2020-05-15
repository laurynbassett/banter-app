import firebase, { auth, db } from "../Firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { fetchAllChats } from "./chats";

const usersRef = db.ref("users");

// ---------- ACTION TYPES ---------- //
const GET_USER = "GET_USER";
const UPDATE_USER_NAME = "UPDATE_USER_NAME";
const UPDATE_LANG = "UPDATE_LANG";
const GET_CHATROOMS = "GET_CHATROOMS";
const ADD_CONTACT = "ADD_CONTACT";
const ADD_CHATROOM = "ADD_CHATROOM";
const ADD_CONTACT_ERROR = "ADD_CONTACT_ERROR";
const SET_NOTIFICATION_TOKEN = "SET_NOTIFICATION_TOKEN";
const SET_NOTIFICATION_STATUS = "SET_NOTIFICATION_STATUS";

// ---------- ACTION CREATORS ---------- //
const getUser = (user) => ({ type: GET_USER, user });
const updateUserName = (name) => ({ type: UPDATE_USER_NAME, name });
const updateLang = (lang) => ({ type: UPDATE_LANG, lang });
const getChatrooms = (chatrooms) => ({ type: GET_CHATROOMS, chatrooms });
const addContact = (contact) => ({ type: ADD_CONTACT, contact });
const addContactError = (message) => ({ type: ADD_CONTACT, message });

const setNotificationToken = (token) => ({
  type: SET_NOTIFICATION_TOKEN,
  token,
});
const setNotificationStatus = (status) => ({
  type: SET_NOTIFICATION_STATUS,
  status,
});

// ---------- THUNK CREATORS ---------- //

export const fetchUser = () => async (dispatch, getState) => {
  try {
    const uid = getState().firebase.auth.uid;

    const snapshot = await firebase
      .database()
      .ref("/users/" + uid)
      .once("value");

    dispatch(getUser(snapshot.val()));
  } catch (err) {
    console.log("Error adding new contact: ", err);
  }
};

export const fetchChatrooms = () => async (dispatch, getState) => {
  try {
    let chatrooms = [];
    const state = getState();
    const uid = state.firebase.auth.uid;

    db.ref(`users/${uid}`).on("value", (user) => {
      if (user.child("chatrooms").exists()) {
        const chatroomIds = Object.keys(user.child("chatrooms").val());
        chatroomIds.forEach((chatroomId) => {
          chatrooms.push(chatroomId);
        });
      }
      console.log("FETCHED CHATROOMS: ", chatrooms);
      dispatch(getChatrooms(chatrooms));
    });
  } catch (err) {
    console.log("Error fetching user chatrooms: ", err);
  }
};

export const addNewChatroom = (chatId, userId) => async () => {
  try {
    usersRef.child(userId).once("value", (user) => {
      if (user.child("chatrooms").exists()) {
        db.ref(`users/${userId}`)
          .child("chatrooms")
          .update({ [chatId]: true });
      } else {
        db.ref(`users/${userId}`)
          .child("chatrooms")
          .set({ [chatId]: true });
      }
    });
  } catch (err) {
    console.log("Error adding new chatroom: ", err);
  }
};

export const addNewContact = ({ name, email, phone }) => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const uid = state.firebase.auth.uid;
    const userRef = db.ref(`users/${uid}`);
    let matchEmail = "";
    let matchEmailUserId = "";
    let matchPhone = "";
    let matchPhoneUserId = "";
    await usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value", (snapshot) => {
        matchEmail = snapshot.val();
        matchEmailUserId = matchEmail ? Object.keys(matchEmail)[0] : "";
      });
    await usersRef
      .orderByChild("phone")
      .equalTo(phone)
      .once("value", (snapshot) => {
        matchPhone = snapshot.val();
        matchPhoneUserId = matchPhone ? Object.keys(matchPhone)[0] : "";
      });

    if (matchEmail) {
      userRef.child("contacts").update({ [matchEmailUserId]: true });
    } else if (matchPhone) {
      userRef.child("contacts").update({ [matchPhoneUserId]: true });
    } else {
      // send error (contact doesn't exist)
      dispatch(addContactError("User doesn't exist!"));
    }
  } catch (err) {
    console.log("Error adding new contact: ", err);
  }
};

export const putUserName = (firstName, lastName) => async (
  dispatch,
  getState
) => {
  try {
    const uid = getState().firebase.auth.uid;
    const fullName = `${firstName} ${lastName}`;
    await firebase
      .database()
      .ref("/users/" + uid)
      .update({ name: fullName });

    dispatch(updateUserName(fullName));
  } catch (err) {
    console.error(err);
  }
};

export const putLang = (lang) => async (dispatch, getState) => {
  try {
    const uid = getState().firebase.auth.uid;
    await firebase
      .database()
      .ref("/users/" + uid)
      .update({ language: lang });

    dispatch(updateLang(lang));
  } catch (err) {
    console.error(err);
  }
};

export const fetchContacts = () => async (dispatch) => {
  try {
    const userId = auth.currentUser.uid;

    db.ref(`users/${userId}/contacts`).on("child_added", function (snapshot) {
      db.ref(`users/${snapshot.key}`)
        .once("value")
        .then((snapshot) => {
          // add id to chat object
          let newContact = snapshot.val();
          newContact.id = snapshot.key;
          newContact.name = newContact.name || "";
          newContact.email = newContact.email;
          newContact.phone = newContact.phone || "";
          newContact.imageUrl = newContact.imageUrl || "";

          // add new chat to state
          dispatch(addContact(newContact));
        });
    });
  } catch (err) {
    console.log("Error fetching contacts: ", err);
  }
};

export const registerForPushNotificationsAsync = () => async (
  dispatch,
  getState
) => {
  // isDevice checks that user is not on a simulator, but actually on a real device
  try {
    const uid = getState().firebase.auth.uid;
    if (Constants.isDevice) {
      // status returns either "undetermined", "granted", or "denied"
      // "undetermined" means the user has not either granted or denied when prompted
      // "granted" means the user answered yes to turning on push notifications
      // "denied" means the user rejected push notifications
      // source: https://docs.expo.io/versions/latest/sdk/permissions/#returns

      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      console.log("EXISTING STATUS OF NOTIFICATION", existingStatus);
      // Don't want to ask the user every time they login
      if (existingStatus !== "granted") {
        //This command initiates notification popup
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );

        //IF permission is granted, finalStatus will === "granted"
        finalStatus = status;
        console.log("FINAL STATUS OF NOTIFICATION", finalStatus);
        // if finalStatus !== existingStatus --> update users/uid/notifications/status
        if (finalStatus !== existingStatus) {
          await firebase
            .database()
            .ref("/users/" + uid + "/notifications")
            .update({ status: finalStatus });
        }
        dispatch(setNotificationStatus(finalStatus));
      }

      if (finalStatus !== "granted") {
        return;
      }

      // Store token in users/uid/notifications/token
      let token = await Notifications.getExpoPushTokenAsync();
      await firebase
        .database()
        .ref("/users/" + uid + "/notifications")
        .update({ token: token });

      // TODO: Persist token to store
      dispatch(setNotificationToken(token));
    } else {
      alert("Must use physical device for Push Notifications");
    }
  } catch (err) {
    console.error(err);
  }
};

// ---------- INITIAL STATE ---------- //
const defaultUser = {
  id: "",
  name: "",
  email: "",
  phone: "",
  imageUrl: "",
  language: "",
  unseenCount: null,
  contacts: [],
  chatrooms: [],
  error: "",
  notification: {},
};

// ---------- REDUCER ---------- //
const userReducer = (state = defaultUser, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        id: action.user.id,
        name: action.user.name,
        email: action.user.email,
        phone: action.user.phone,
        imageUrl: action.user.imageUrl,
        created_at: action.user.created_at,
        language: action.user.language,
      };
    case UPDATE_USER_NAME:
      return { ...state, name: action.name };
    case SET_NOTIFICATION_TOKEN:
      return {
        ...state,
        notification: { ...state.notification, token: action.token },
      };
    case SET_NOTIFICATION_STATUS:
      return {
        ...state,
        notification: { ...state.notification, status: action.status },
      };
    case UPDATE_LANG:
      return { ...state, language: action.lang };
    case GET_CHATROOMS:
      return { ...state, chatrooms: action.chatrooms };
    case ADD_CONTACT:
      return { ...state, contacts: [...state.contacts, action.contact] };
    case ADD_CONTACT_ERROR:
      return { ...state, error: state.message };
    default:
      return state;
  }
};
export default userReducer;
