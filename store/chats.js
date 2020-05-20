import firebase, { auth, db } from "../Firebase";
import { fetchMessages } from "./messages";

const chatsRef = db.ref("chats");

// ---------- ACTION TYPES ---------- //
const ADD_CHAT = "ADD_CHAT";
const UPDATE_CHAT = "UPDATE_CHAT";
const SET_CURRENT_CHAT = "SET_CURRENT_CHAT";
const SET_CURRENT_CHAT_PROPS = "SET_CURRENT_CHAT_PROPS";
const ADD_MEMBERS = "ADD_MEMBERS";
const SET_MEMBERS = "SET_MEMBERS";

// ---------- ACTION CREATORS ---------- //
const addChat = (chat) => ({ type: ADD_CHAT, chat });
const updateChat = (chat) => ({ type: UPDATE_CHAT, chat });
export const setCurrentChat = (chatId) => ({ type: SET_CURRENT_CHAT, chatId });
export const setCurrentChatProps = (chat) => ({
  type: SET_CURRENT_CHAT_PROPS,
  chat,
});
const addMembers = (members) => ({ type: ADD_MEMBERS, members });
// for setting current chat header bar
export const setMembers = (members) => ({ type: SET_MEMBERS, members });

// ---------- THUNK CREATORS ---------- //

// GET ALL CHATS
export const fetchChats = () => async (dispatch) => {
  try {
    const userId = auth.currentUser.uid;

    // get each chatId via user, adding listener for any additional chat rooms added
    db.ref(`users/${userId}/chatrooms`).on("child_added", (snapshot) => {
      db.ref(`chats/${snapshot.key}`)
        .once("value")
        .then((snapshot) => {
          // add id to chat object
          let newChat = snapshot.val();
          newChat.id = snapshot.key;
          // add new chat to state
          dispatch(addChat(newChat));
          // add listener for changes
          db.ref(`chats/${snapshot.key}`).on("child_changed", function (
            updatedSnapshot
          ) {
            // add id to chat object
            let updatedChat = { [updatedSnapshot.key]: updatedSnapshot.val() };
            updatedChat.id = snapshot.key;

            // update chat in state
            dispatch(updateChat(updatedChat));
          });
        });
    });
  } catch (err) {
    console.log("Error fetching all chats: ", err);
  }
};

// GET CURRENT CHAT ID
export const fetchCurrentChatId = (
  { contactId, name },
  { uid, userName },
  navigation
) => async (dispatch, getState) => {
  try {
    let currChatId = "";
    // check if chat exists w/ contact
    console.log("CHATS", getState().chats);
    console.log("CHATS.CHATS", getState().chats.chats);
    console.log("CHATS.CURRENTCHAT", getState().chats.currentChat);

    const chat = getState().chats.chats.find((chat) =>
      Object.keys(chat.members).includes(contactId)
    );

    if (chat) {
      currChatId = chat.id;
      // if existing chat, set current chat on redux state
      dispatch(setCurrentChat(currChatId));
    } else {
      // if no existing chat, set current chat members on state
      dispatch(
        setCurrentChatProps({ members: { [uid]: userName, [contactId]: name } })
      );
    }
    // navigate to single chat screen
    navigation.navigate("SingleChat", { contactId, name });
  } catch (err) {
    console.log("Error fetching current chat ID: ", err);
  }
};

// CREATE NEW CHAT ID
export const createCurrentChatId = () => async (dispatch) => {
  try {
    const newChatRef = await chatsRef.push();
    const newChatId = newChatRef.key;
    dispatch(setCurrentChatProps({ id: newChatId }));
    dispatch(fetchMessages());
    return newChatId;
  } catch (err) {
    console.log("Error creating current chat ID: ", err);
  }
};

// ADD MEMBERS TO CURRENT CHAT
export const addNewMembers = (chatId, members) => async () => {
  try {
    db.ref(`chats/${chatId}`).child("members").set(members);
  } catch (err) {
    console.log("Error adding new members: ", err);
  }
};

// ---------- INITIAL STATE ---------- //
const defaultChats = {
  chats: [],
  currentChat: {},
};

// ---------- REDUCER ---------- //
const chatsReducer = (state = defaultChats, action) => {
  switch (action.type) {
    case ADD_CHAT:
      console.log("STATE", state);
      return { ...state, chats: [...state.chats, action.chat] };
    case UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id === action.chat.id) {
            return Object.assign({}, chat, action.chat);
          }
          return chat;
        }),
      };
    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: state.chats.find((chat) => chat.id === action.chatId),
      };
    case SET_CURRENT_CHAT_PROPS:
      return {
        ...state,
        currentChat: Object.assign({}, state.currentChat, action.chat),
      };
    case SET_MEMBERS:
      return { ...state, currentChat: { members: members } };
    case ADD_MEMBERS:
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          members: Object.assign({}, state.currentChat.members, action.members),
        },
      };
    default:
      return state;
  }
};

export default chatsReducer;
