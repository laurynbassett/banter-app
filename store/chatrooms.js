import firebase, { auth, db } from '../Firebase';
const chatroomsRef = db.ref('chatrooms');

// ---------- ACTION TYPES ---------- //
const GET_CHATROOMS = 'GET_CHATROOMS';
const ADD_CHATROOM = 'ADD_CHATROOM';

// ---------- ACTION CREATORS ---------- //

const getChatrooms = chatrooms => ({ type: GET_CHATROOMS, chatrooms });
const addChatroom = chatId => ({ type: ADD_CHATROOM, chatId });

// ---------- THUNK CREATORS ---------- //
export const fetchChatrooms = uid => async (dispatch, getState) => {
	try {
		let chatrooms = [];

		const state = getState();
		console.log('FETCH CHATROOMS STATE: ', state);

		chatroomsRef.once('value', snapshot => {
			if (snapshot.child(uid).exists()) {
				db.ref(`chatrooms/${uid}`).on('value', userChats => {
					console.log('FETCH CHATROOMS: ', Object.keys(userChats.val()));
					Object.keys(userChats.val()).forEach(chatId => {
						console.log('CHILD CHATROOM VAL: ', chatId);
						chatrooms.push(chatId);
					});
				});
			}
		});

		console.log('FETCHED CHATROOMS', chatrooms);
		dispatch(getChatrooms(chatrooms));
	} catch (err) {
		console.log('Error fetching chatrooms: ', err);
	}
};

export const addNewChatroom = uid => async (dispatch, getState) => {
	try {
		const state = getState();
		const chatId = state.chats.currentChat.currentChatId;
		console.log('ADD NEW CHATROOM PROPS: ', uid, 'chatID: ', chatId);

		chatroomsRef.once('value', snapshot => {
			if (snapshot.child(uid).exists()) {
				const userChatroomsRef = db.ref(`chatrooms/${uid}`);
				console.log('USER CHATROOM EXISTS: ', userChatroomsRef);
				userChatroomsRef.update({ [chatId]: true });
				console.log('PASSED', userChatroomsRef);
			} else {
				console.log('NEW CHILD');
				chatroomsRef.child(uid).update({ [chatId]: true });
			}
		});

		console.log('DISPTACHING ADD CHATROOM', chatId);
		dispatch(addChatroom(chatId));
	} catch (err) {
		console.log('Error adding new chatroom: ', err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultChatrooms = [];

// ---------- REDUCER ---------- //
const chatroomsReducer = (state = defaultChatrooms, action) => {
	switch (action.type) {
		case GET_CHATROOMS:
			return action.chatrooms;
		case ADD_CHATROOM:
			return state.includes(chatId) ? state : [ ...state, action.chatId ];
		default:
			return state;
	}
};

export default chatroomsReducer;
