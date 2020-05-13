import { db } from '../Firebase';

const chatsRef = db.ref('chats');

// ---------- ACTION TYPES ---------- //
const GET_ALL_CHATS = 'GET_ALL_CHATS';
const GET_CURRENT_CHAT = 'GET_CURRENT_CHAT';
const SET_CURRENT_CHAT_ID = 'SET_CURRENT_CHAT';
const ADD_MEMBER = 'ADD_MEMBER';

// ---------- ACTION CREATORS ---------- //
const getAllChats = chats => ({ type: GET_ALL_CHATS, chats });
const getCurrentChat = chatId => ({ type: GET_CURRENT_CHAT, chatId });
export const setCurrentChatId = chatId => ({ type: SET_CURRENT_CHAT_ID, chatId });
const addMember = member => ({ type: ADD_MEMBERS, member });

// ---------- THUNK CREATORS ---------- //
export const fetchAllChats = () => async (dispatch, getState) => {
	try {
		let chats = [];

		const state = getState();
		const uid = state.firebase.auth.uid;

		db.ref(`users/${uid}/chatrooms`).on('value', userChats => {
			chats = Object.keys(userChats.val());
			console.log('CHATS', chats);
		});

		dispatch(getAllChats(chats));
	} catch (err) {
		console.log('Error fetching all chats: ', err);
	}
};

export const fetchCurrentChatId = contactId => async (dispatch, getState) => {
	try {
		const state = getState();
		const uid = state.firebase.auth.uid;
		let currChatId = '';
		let matchingChat = '';
		// async-await
		db.ref(`users/${contactId}`).once('value', contact => {
			if (contact.child('chatrooms').exists()) {
				db
					.ref(`users/${uid}/chatrooms`)
					.once('value')
					.then(userChats => {
						console.log('USER CHATS', userChats);
						const contactChats = contact.child('chatrooms').val();
						matchingChat = Object.keys(contactChats).find(chatId => {
							console.log('CHILD CHAT VAL: ', chatId);
							console.log('OBJETC KYES', Object.keys(userChats.val()));
							return Object.keys(userChats.val()).includes(chatId);
						});
					})
					.then(() => {
						currChatId = matchingChat ? matchingChat : '';
						console.log('CURRENT CHAT: ', currChatId);
						dispatch(setCurrentChatId(currChatId));
					});
			}
		});
	} catch (err) {
		console.log('Error fetching current chat ID: ', err);
	}
};

export const createCurrentChatId = () => async dispatch => {
	try {
		const newChatRef = await chatsRef.push();
		const newChatId = newChatRef.key;
		console.log('CREATE CHAT ID REF: ', newChatRef);
		console.log('CREATE CHAT ID KEY: ', newChatId);
		dispatch(getCurrentChat(newChatId));
		return newChatId;
	} catch (err) {
		console.log('Error creating current chat ID: ', err);
	}
};

// for SingleChatHeader
export const fetchMemberNames = () => async (dispatch, getState) => {
	try {
		const state = getState();
		db.ref(`chats/${state.chats.currentChat.me}`);
	} catch (err) {
		console.log('Error fetching current chat member names: ', err);
	}
};

export const addNewMember = (chatId, userId) => async (dispatch, getState) => {
	try {
		chatsRef.child(chatId).once('value', chat => {
			if (chat.child('members').exists()) {
				db
					.ref(`chats/${chatId}/members`)
					.update({ [userId]: true })
					.then(() => dispatch(fetchAllChats()))
					.catch(err => console.log('Error updating members', err));
			} else {
				db
					.ref(`chats/${chatId}`)
					.child('members')
					.set({ [userId]: true })
					.then(() => dispatch(fetchAllChats()))
					.catch(err => console.log('Error setting member', err));
			}
		});
	} catch (err) {
		console.log('Error adding new members: ', err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultChats = {
	chats: [],
	currentChat: {}
};

// ---------- REDUCER ---------- //
const chatsReducer = (state = defaultChats, action) => {
	switch (action.type) {
		case GET_ALL_CHATS:
			return { ...state, chats: action.chats };
		case GET_CURRENT_CHAT:
			return { ...state, currentChat: { ...state.currentChat, currentChatId: action.chatId } };
		case SET_CURRENT_CHAT_ID:
			return { ...state, currentChat: { ...state.currentChat, currentChatId: action.chatId } };
		case ADD_MEMBER:
			return {
				...state,
				currentChat: { ...state.currentChat, members: [ ...state.currentChat.members, state.member ] }
			};
		default:
			return state;
	}
};

export default chatsReducer;
