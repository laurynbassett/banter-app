import { db } from '../Firebase';

import { fetchAllChats } from './chats';

const usersRef = db.ref('users');

// ---------- ACTION TYPES ---------- //
const GET_USER = 'GET_USER';
const GET_CHATROOMS = 'GET_CHATROOMS';
const ADD_CONTACT = 'ADD_CONTACT';
const ADD_CHATROOM = 'ADD_CHATROOM';
const ADD_CONTACT_ERROR = 'ADD_CONTACT_ERROR';
const GET_CONTACTS = 'GET_CONTACTS';

// ---------- ACTION CREATORS ---------- //
const getUser = user => ({ type: GET_USER, user });
const getChatrooms = chatrooms => ({ type: GET_CHATROOMS, chatrooms });
const addChatroom = chatId => ({ type: ADD_CHATROOM, chatId });
const addContact = contact => ({ type: ADD_CONTACT, contact });
const addContactError = message => ({ type: ADD_CONTACT, message });
const getContacts = contacts => ({ type: GET_CONTACTS, contacts });
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
			dispatch(fetchAllChats());
		});
	} catch (err) {
		console.log('Error fetching user chatrooms: ', err);
	}
};

export const addNewChatroom = (chatId, userId) => async (dispatch, getState) => {
	try {
		const state = getState();
		usersRef.child(userId).once('value', user => {
			if (user.child('chatrooms').exists()) {
				db
					.ref(`users/${userId}`)
					.child('chatrooms')
					.update({ [chatId]: true })
					.then(() => dispatch(addChatroom(chatId)))
					.catch(err => console.log('Error updating chatroom', err));
			} else {
				db
					.ref(`users/${userId}`)
					.child('chatrooms')
					.set({ [chatId]: true })
					.then(() => dispatch(addChatroom(chatId)))
					.catch(err => console.log('Error updating chatroom', err));
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
		const matchEmail = await usersRef.orderByChild('email').equalTo(email).once('value');
		const matchPhone = await usersRef.orderByChild('phone').equalTo(phone).once('value');

		if (matchEmail) {
			const id = Object.values(matchEmail)[0].children_.root_.key;
			db.ref(`users/${id}`).once('value', contactRef => {
				const name = contactRef.child('name').val();
				const email = contactRef.child('email').val();
				const imageUrl = contactRef.child('imageUrl').val();
				const language = contactRef.child('language').val();
				userRef.child('contacts').update({ [id]: true });
				dispatch(addContact({ id, name, email, imageUrl, language }));
			});
		} else if (matchPhone) {
			const id = Object.values(matchPhone)[0].children_.root_.key;
			db.ref(`users/${id}`).once('value', contactRef => {
				const name = contactRef.child('name').val();
				const email = contactRef.child('email').val();
				const imageUrl = contactRef.child('imageUrl').val();
				const language = contactRef.child('language').val();
				userRef.child('contacts').update({ [id]: true });
				dispatch(addContact({ id, name, email, imageUrl, language }));
			});
		} else {
			// send error (contact doesn't exist)
			dispatch(addContactError("User doesn't exist!"));
		}
	} catch (err) {
		console.log('Error adding new contact: ', err);
	}
};

export const fetchContacts = () => async (dispatch, getState) => {
	try {
		const state = getState();

		const id = state.user.id;
		let contacts = [];
		const contactKeys = Object.keys(state.firebase.profile.contacts);
		const getAllContacts = async () => {
			for (let key of contactKeys) {
				await db.ref(`users/${key}`).once('value', contact => {
					const name = contact.child('name').val();
					const email = contact.child('email').val();
					const phone = contact.child('phone').val() || '';
					const imageUrl = contact.child('imageUrl').val() || '';
					contacts.push({ id: key, name, email, phone, imageUrl });
				});
			}
		};
		getAllContacts().then(() => {
			dispatch(getContacts(contacts));
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
	contactObjs: [],
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
		case ADD_CHATROOM:
			return { ...state, chatrooms: [ ...state.chatrooms, action.chatId ] };
		case ADD_CONTACT_ERROR:
			return { ...state, error: state.message };
		case GET_CONTACTS:
			return { ...state, contactObjs: action.contacts };
		default:
			return state;
	}
};
export default userReducer;
