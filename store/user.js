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
const addChatroom = (chatId) => ({ type: ADD_CHATROOM, chatId });
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

// export const addNewContact = contact => async (dispatch, getState) => {
// 	try {
// 		const uid = auth.currentUser.uid
// 		db.ref(`users/${uid}`).once('value', snapshot => {
// 			if (snapshot.val()) {
// 				snap
// 			}
// 		})
// 	} catch (err) {
// 		console.log('Error adding new contact: ', err)
// 	}
// }

export const fetchChatrooms = () => async (dispatch, getState) => {
  try {
    let chatrooms = [];
    const uid = auth.currentUser.uid;
    // console.log("FETCH USER CHATROOMS UID", uid);

    const state = getState();
    console.log("FETCH USER CHATROOMS STATE: ", state);

    db.ref(`users/${uid}`).on("value", (user) => {
      if (user.child("chatrooms").exists()) {
        const chatroomIds = Object.keys(chatrooms.val());
        console.log("FETCH USER CHATROOMS: ", chatroomIds);
        chatroomIds.forEach((chatroomId) => {
          console.log("USER CHATROOM CHILD: ", chatroomId);
          chatrooms.push(chatroomId);
        });
      }
    });

    console.log("FETCHED CHATROOMS: ", chatrooms);
    dispatch(getChatrooms(chatrooms));
    dispatch(fetchAllChats());
  } catch (err) {
    console.log("Error fetching user chatrooms: ", err);
  }
};

export const addNewChatroom = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const uid = auth.currentUser.uid;
    const chatId = state.chats.currentChat.currentChatId;
    console.log("ADD NEW CHATROOM PROPS: ", uid, "chatID: ", chatId);

    db.ref(`users/${uid}/chatrooms`).on("value", (chatrooms) => {
      chatrooms.update({ [chatId]: true });
      console.log("POST-ADD USER CHATROOMS: ", chatrooms.val());
    });

    console.log("DISPATCHING ADD CHATROOM", chatId);
    dispatch(addChatroom(chatId));
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
    const uid = auth.currentUser.uid;

    const matchEmail = usersRef.orderByChild("email").equalTo(email);
    console.log("MATCHEMAIL", matchEmail);
    const matchPhone = usersRef.orderByChild("phone").equalTo(phone);
    console.log("MATCHPHONE", matchPhone);
    // if (uid.child('email').exists()) {
    // 	} else if (uid.child('phone').exists()) {
    if (matchEmail || matchPhone) {
      // db.ref(`users/${uid}`).once('value', user => {
      // 	user.child('contacts').update()
      // })
    } else {
      // send error (contact doesn't exist)
      const errMsg = "There is no user with the given email or phone number.";
      dispatch(addContactError(errMsg));
    }
  } catch (err) {
    console.log("Error adding new contact: ", err);
  }
};

export const fetchUser = () => async (dispatch, getState) => {
  try {
    const uid = getState().firebase.auth.uid;

    const snapshot = await firebase
      .database()
      .ref("/users/" + uid)
      .once("value");

    dispatch(getUser(snapshot.val()));
  } catch (err) {
    console.error(err);
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
  name: "",
  email: "",
  phone: "",
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
        email: action.user.email,
        created_at: action.user.created_at,
        language: action.user.language,
        name: action.user.name,
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
    case ADD_CHATROOM:
      return { ...state, chatrooms: [...state.chatrooms, action.chatId] };
    case ADD_CONTACT_ERROR:
      return { ...state, error: state.message };
    default:
      return state;
  }
};
export default userReducer;
