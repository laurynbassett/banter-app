import firebase, { auth, db } from '../Firebase';
import { fetchChatrooms } from './chatrooms';

const chatsRef = db.ref('chats');
const chatroomsRef = db.ref('chatrooms');

// ---------- ACTION TYPES ---------- //
const GET_ALL_CHATS = 'GET_ALL_CHATS';
const GET_CURRENT_CHAT = 'GET_CURRENT_CHAT';

// ---------- ACTION CREATORS ---------- //
export const getAllChats = chats => ({ type: GET_ALL_CHATS, chats });
export const getCurrentChat = chatId => ({
	type: GET_CURRENT_CHAT,
	chatId
});

// ---------- THUNK CREATORS ---------- //
export const fetchAllChats = () => async (dispatch, getState) => {
	try {
		const state = getState();
		console.log('FETCH ALL CHATS STATE: ', state);

		let chats = [];
		const uid = auth.currentUser.uid;
		console.log('FETCH ALL CHATS UID', uid);
		state.chatrooms.forEach(chatId => {
			db.ref(`chats/${chatId}`).on('value', chatRef => {
				const id = chatRef.key;
				const lastMessage = chatRef.child('lastMessage').val();
				const senderId = chatRef.child('senderId').val();
				const timestamp = chatRef.child('timestamp').val();
				chats.push({ id, lastMessage, senderId, timestamp });
			});
		});

		console.log('FETCHED CHATS:', chats);
		dispatch(getAllChats(chats));
	} catch (err) {
		console.log('Error fetching all chats: ', err);
	}
};

export const fetchCurrentChatId = contactId => async (dispatch, getState) => {
	try {
		const state = getState();
		console.log('FETCH CURR CHAT ID STATE: ', state);
		let currChatId = '';

		chatroomsRef.on('value', snapshot => {
			if (snapshot.child(contactId).exists()) {
				db.ref(`chatrooms/${contactId}`).on('value', contactChats => {
					console.log('FETCH CURRENT CHAT - CONTACT CHATS: ', Object.keys(contactChats.val()));
					const matchingChat = Object.keys(contactChats.val()).find(chatId => {
						console.log('CHILD CHAT VAL: ', chatId);
						console.log('STATE CHATS: ', state.chatrooms);
						console.log('INCLUDES?: ', state.chatrooms.includes(String(chatId)));
						return state.chatrooms.includes(chatId);
					});
					console.log('****MATCHING CHAT: ', matchingChat);
					currChatId = matchingChat ? matchingChat : '';
					console.log('CURRENT CHAT: ', currChatId);
					dispatch(getCurrentChat(currChatId));
				});
			}
		});
	} catch (err) {
		console.log('Error fetching current chat ID: ', err);
	}
};

export const createCurrentChatId = () => async dispatch => {
	try {
		const newChatRef = chatsRef.push();
		const newChatId = newChatRef.key;
		console.log('CREATE CHAT ID REF: ', newChatRef);
		console.log('CREATE CHAT ID KEY: ', newChatId);

		dispatch(getCurrentChat(newChatId));
		return newChatId;
	} catch (err) {
		console.log('Error creating current chat ID: ', err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultChats = {
	chats: [],
	currentChat: {
		currentChatId: '',
		lastMessage: '',
		timestamp: null
	}
};

// ---------- REDUCER ---------- //
const chatsReducer = (state = defaultChats, action) => {
	switch (action.type) {
		case GET_ALL_CHATS:
			return { ...state, chats: action.chats };
		case GET_CURRENT_CHAT:
			return { ...state, currentChat: { ...state.currentChat, currentChatId: action.chatId } };
		default:
			return state;
	}
};

export default chatsReducer;
