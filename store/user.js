import { auth, db } from '../Firebase';

const usersRef = db.ref('users');

// ---------- ACTION TYPES ---------- //
const GET_USER = 'GET_USER';
const GET_CHATROOMS = 'GET_CHATROOMS';
const ADD_CONTACT = 'ADD_CONTACT';
const ADD_CONTACT_ERROR = 'ADD_CONTACT_ERROR';
const GET_CONTACTS = 'GET_CONTACTS';

// ---------- ACTION CREATORS ---------- //
const getUser = user => ({ type: GET_USER, user });
const getChatrooms = chatrooms => ({ type: GET_CHATROOMS, chatrooms });
const addContact = contact => ({ type: ADD_CONTACT, contact });
const addContactError = message => ({ type: ADD_CONTACT, message });

// ---------- THUNK CREATORS ---------- //

export const fetchUser = () => async (dispatch, getState) => {
	try {
		const state = getState();
		const user = state.firebase.auth;
		console.log('GET USER - FIREBASE USER: ', user);
		dispatch(
			getUser({
				id: user.uid,
				email: user.email,
				name: user.displayName,
				phone: user.phoneNumber,
				imageUrl: user.photoURL
			})
		);
	} catch (err) {
		console.log('Error adding new contact: ', err);
	}
};

export const fetchChatrooms = () => async (dispatch, getState) => {
	try {
		let chatrooms = [];
		const state = getState();
		const uid = state.firebase.auth.uid;

		db.ref(`users/${uid}`).on('value', user => {
			if (user.child('chatrooms').exists()) {
				const chatroomIds = Object.keys(user.child('chatrooms').val());
				chatroomIds.forEach(chatroomId => {
					chatrooms.push(chatroomId);
				});
			}
			console.log('FETCHED CHATROOMS: ', chatrooms);
			dispatch(getChatrooms(chatrooms));
		});
	} catch (err) {
		console.log('Error fetching user chatrooms: ', err);
	}
};

export const addNewChatroom = (chatId, userId) => async () => {
	try {
		usersRef.child(userId).once('value', user => {
			if (user.child('chatrooms').exists()) {
				db.ref(`users/${userId}`).child('chatrooms').update({ [chatId]: true });
			} else {
				db.ref(`users/${userId}`).child('chatrooms').set({ [chatId]: true });
			}
		});
	} catch (err) {
		console.log('Error adding new chatroom: ', err);
	}
};

export const addNewContact = ({ name, email, phone }) => async (dispatch, getState) => {
	try {
		const state = getState();
		const uid = state.firebase.auth.uid;
		const userRef = db.ref(`users/${uid}`);
		let matchEmail = '';
		let matchEmailUserId = '';
		let matchPhone = '';
		let matchPhoneUserId = '';
		await usersRef.orderByChild('email').equalTo(email).once('value', snapshot => {
			matchEmail = snapshot.val();
			matchEmailUserId = matchEmail ? Object.keys(matchEmail)[0] : '';
		});
		await usersRef.orderByChild('phone').equalTo(phone).once('value', snapshot => {
			matchPhone = snapshot.val();
			matchPhoneUserId = matchPhone ? Object.keys(matchPhone)[0] : '';
		});

		if (matchEmail) {
			userRef.child('contacts').update({ [matchEmailUserId]: true });
		} else if (matchPhone) {
			userRef.child('contacts').update({ [matchPhoneUserId]: true });
		} else {
			// send error (contact doesn't exist)
			dispatch(addContactError("User doesn't exist!"));
		}
	} catch (err) {
		console.log('Error adding new contact: ', err);
	}
};

export const fetchContacts = () => async dispatch => {
	try {
		const userId = auth.currentUser.uid;

		db.ref(`users/${userId}/contacts`).on('child_added', function(snapshot) {
			db.ref(`users/${snapshot.key}`).once('value').then(snapshot => {
				// add id to chat object
				let newContact = snapshot.val();
				newContact.id = snapshot.key;
				newContact.name = newContact.name || '';
				newContact.email = newContact.email;
				newContact.phone = newContact.phone || '';
				newContact.imageUrl = newContact.imageUrl || '';

				// add new chat to state
				dispatch(addContact(newContact));
			});
		});
	} catch (err) {
		console.log('Error fetching contacts: ', err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultUser = {
	id: '',
	name: '',
	email: '',
	phone: '',
	imageUrl: '',
	language: '',
	unseenCount: null,
	contacts: [],
	chatrooms: [],
	error: ''
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
				imageUrl: action.user.imageUrl
			};
		case GET_CHATROOMS:
			return { ...state, chatrooms: action.chatrooms };
		case ADD_CONTACT:
			return { ...state, contacts: [ ...state.contacts, action.contact ] };
		case ADD_CONTACT_ERROR:
			return { ...state, error: state.message };
		default:
			return state;
	}
};
export default userReducer;
