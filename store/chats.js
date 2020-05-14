import firebase, { auth, db } from '../Firebase';

const chatsRef = db.ref('chats');

// ---------- ACTION TYPES ---------- //
const ADD_CHAT = 'ADD_CHAT';
const UPDATE_CHAT = 'UPDATE_CHAT';
const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
const ADD_MEMBER = 'ADD_MEMBER';

// ---------- ACTION CREATORS ---------- //
const addChat = chat => ({ type: ADD_CHAT, chat });
const updateChat = chat => ({ type: UPDATE_CHAT, chat });
export const setCurrentChat = chatId => ({ type: SET_CURRENT_CHAT, chatId });
const addMember = member => ({ type: ADD_MEMBERS, member });

// ---------- THUNK CREATORS ---------- //
export const fetchAllChats = () => async (dispatch, getState) => {
	try {
		const userId = auth.currentUser.uid;
		console.log('FETCHING ALL CHATS');

		// TODO: remove hard coded user ID from Firebase query
		// get each chat id from the user, adding a listener for any additional chat rooms added
		db.ref(`users/${userId}/chatrooms`).on('child_added', function(snapshot) {
			db.ref(`chats/${snapshot.key}`).once('value').then(snapshot => {
				// add id to chat object
				let newChat = snapshot.val();
				newChat.id = snapshot.key;

				// add new chat to state
				dispatch(addChat(newChat));

				// add listener for changes
				db.ref(`chats/${snapshot.key}`).on('child_changed', function(updatedSnapshot) {
					// add id to chat object
					let updatedChat = { [updatedSnapshot.key]: updatedSnapshot.val() };
					updatedChat.id = snapshot.key;

					// update chat in state
					dispatch(updateChat(updatedChat));
				});
			});
		});
	} catch (err) {
		console.log('Error fetching all chats: ', err);
	}
};

export const fetchCurrentChatId = (contactId, uid) => async (dispatch, getState) => {
	try {
		console.log('FETCH CURRENT CHAT ID PROPS', 'contactId: ', contactId, '; uid: ', uid);
		let currChatId = '';
		// async-await
		const state = getState();
		state.chats.chats.forEach(chat => {
			if (chat.members.includes(contactId)) {
				currChatId = chat.id;
			}
		});
		dispatch(setCurrentChat(currChatId));
	} catch (err) {
		console.log('Error fetching current chat ID: ', err);
	}
};

export const createCurrentChatId = () => async dispatch => {
	try {
		const newChatRef = await chatsRef.push();
		const newChatId = newChatRef.key;
		dispatch(setCurrentChat(newChatId));
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
		case ADD_CHAT:
			return { ...state, chats: [ ...state.chats, action.chat ] };
		case UPDATE_CHAT:
			return {
				...state,
				chats: state.chats.map(chat => {
					if (chat.id === action.chat.id) {
						return { ...chat, ...action.chat };
					}
					return chat;
				})
			};
		case SET_CURRENT_CHAT:
			console.log('SET CURRENT CHAT CURRENT STATE', state);
			return {
				...state,
				currentChat: state.chats.find(chat => chat.id === action.chatId)
			};
		case ADD_MEMBER:
			return {
				...state,
				currentChat: {
					...state.currentChat,
					members: [ ...state.currentChat.members, state.member ]
				}
			};
		default:
			return state;
	}
};

export default chatsReducer;
