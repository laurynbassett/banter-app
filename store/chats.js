import firebase, { auth, db } from "../Firebase";

const chatsRef = db.ref("chats");

// ---------- ACTION TYPES ---------- //
const GET_ALL_CHATS = "GET_ALL_CHATS";
const GET_CURRENT_CHAT = "GET_CURRENT_CHAT";

// ---------- ACTION CREATORS ---------- //
export const getAllChats = (chats) => ({ type: GET_ALL_CHATS, chats });
export const getCurrentChat = (chatId) => ({
  type: GET_CURRENT_CHAT,
  chatId,
});

// ---------- THUNK CREATORS ---------- //
export const fetchAllChats = () => async (dispatch, getState) => {
  try {
    const state = getState();
    console.log("FETCH ALL CHATS STATE: ", state);

    let chats = [];
    const uid = auth.currentUser.uid;
    console.log("FETCH ALL CHATS UID", uid);
    db.ref(`chats/${chatId}`).once("value", (snapshot) => {
      console.log(
        "*****snapshot.child(uid).exists",
        snapshot.child(uid).exists()
      );
      if (snapshot.child(uid).exists()) {
        console.log("snapshot.child(uid)", snapshot.child(uid));
        state.user.chatrooms.forEach((chatrmId) => {
          const chatroomRef = db.ref(`chats/${chatrmId}`);
          const chatroomId = chatroomRef.key;
          const lastMessage = chatroomId.child("lastMessage").val();
          const senderId = chatroomId.child("sender").val();
          const timestamp = chatroomId.child("timestamp").val();
          chatObj = { id: chatroomId, lastMessage, senderId, timestamp };
          console.log("CHAT OBJ: ", chatObj);
          chats.push(chatObj);
        });
      }
    });
    console.log("FETCHED CHATS:", chats);
    dispatch(getAllChats(chats));
  } catch (err) {
    console.log("Error fetching all chats: ", err);
  }
};

export const fetchCurrentChatId = (contactId) => async (dispatch, getState) => {
  try {
    const state = getState();
    console.log("FETCH CURR CHAT ID STATE: ", state);
    let currChatId = "";
    // async-await
    db.ref(`users/${contactId}`).once("value", (contact) => {
      if (contact.child("chatrooms").exists()) {
        const contactChats = contact.child("chatrooms").val();
        console.log(
          "FETCH CURRENT CHATID- CONTACT CHATS: ",
          Object.keys(contactChats.val())
        );
        const matchingChat = Object.keys(contactChats).find((chatId) => {
          console.log("CHILD CHAT VAL: ", chatId);
          console.log("STATE CHATS: ", state.user.chatrooms);
          console.log("INCLUDES?: ", state.user.chatrooms.includes(chatId));
          return state.user.chatrooms.includes(chatId);
        });
        console.log("****MATCHING CHAT: ", matchingChat);
        currChatId = matchingChat ? matchingChat : "";
        console.log("CURRENT CHAT: ", currChatId);
        dispatch(setCurrentChat(currChatId));
      }
    });
  } catch (err) {
    console.log("Error fetching current chat ID: ", err);
  }
};

export const createCurrentChatId = () => async (dispatch) => {
  try {
    const newChatRef = chatsRef.push();
    const newChatId = newChatRef.key;
    console.log("CREATE CHAT ID REF: ", newChatRef);
    console.log("CREATE CHAT ID KEY: ", newChatId);

    dispatch(getCurrentChat(newChatId));
    return newChatId;
  } catch (err) {
    console.log("Error creating current chat ID: ", err);
  }
};

// ---------- INITIAL STATE ---------- //
const defaultChats = {
  chats: [],
  currentChat: {
    currentChatId: "",
    lastMessage: "",
    timestamp: null,
  },
};

// ---------- REDUCER ---------- //
const chatsReducer = (state = defaultChats, action) => {
  switch (action.type) {
    case GET_ALL_CHATS:
      return { ...state, chats: action.chats };
    case GET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: { ...state.currentChat, currentChatId: action.chatId },
      };
    default:
      return state;
  }
};

export default chatsReducer;
