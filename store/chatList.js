const GET_CHATS = "GETCHATS";
const ADD_CHAT = "ADDCHATS";
const REMOVE_CHAT = "REMOVECHAT";

export const fetchChats = (chats) => ({
  type: GET_CHATS,
  chats,
});

export const addhat = (chat) => ({
  type: ADD_CHAT,
  chat,
});

export const removeChat = (chat) => ({
  type: REMOVE_CHAT,
  chat,
});

export default function chatListReducer(chatList = [], action) {
  switch (action.type) {
    case GET_CHATS:
      break;
    case ADD_CHAT:
      break;
    case REMOVE_CHAT:
      break;
    default:
      return [];
  }
}
