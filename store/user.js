import firebase, { auth, db } from "../Firebase";
import { fetchAllChats } from "./chats";
const usersRef = db.ref("users");
// ---------- ACTION TYPES ---------- //
const GET_USER = "GET_USER";
const GET_CHATROOMS = "GET_CHATROOMS";
const ADD_CONTACT = "ADD_CONTACT";
const ADD_CHATROOM = "ADD_CHATROOM";
const ADD_CONTACT_ERROR = "ADD_CONTACT_ERROR";
// ---------- ACTION CREATORS ---------- //
const getUser = (user) => ({ type: GET_USER, user });
const getChatrooms = (chatrooms) => ({ type: GET_CHATROOMS, chatrooms });
const addChatroom = (chatId) => ({ type: ADD_CHATROOM, chatId });
const addContact = (contact) => ({ type: ADD_CONTACT, contact });
const addContactError = (message) => ({ type: ADD_CONTACT, message });
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
    console.log("FETCH USER CHATROOMS UID", uid);
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
};
// ---------- REDUCER ---------- //
const userReducer = (state = defaultUser, action) => {
  switch (action.type) {
    case GET_USER:
      return action.user;
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
