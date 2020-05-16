import firebase, { auth, db } from '../Firebase';
import { formatNameHelper } from '../utils';

const usersRef = db.ref('users');

// ---------- ACTION TYPES ---------- //
const GET_USER = 'GET_USER';
const UPDATE_USER_NAME = 'UPDATE_USER_NAME';
const UPDATE_LANG = 'UPDATE_LANG';
const GET_CONTACTS = 'GET_CONTACTS';
const ADD_CONTACT = 'ADD_CONTACT';
const ADD_CONTACT_ERROR = 'ADD_CONTACT_ERROR';

// ---------- ACTION CREATORS ---------- //
const getUser = user => ({ type: GET_USER, user });
const updateUserName = name => ({ type: UPDATE_USER_NAME, name });
const updateLang = lang => ({ type: UPDATE_LANG, lang });
const getContacts = contacts => ({ type: GET_CONTACTS, contacts });
const addContact = contact => ({ type: ADD_CONTACT, contact });
const addContactError = message => ({ type: ADD_CONTACT_ERROR, message });

// ---------- THUNK CREATORS ---------- //

// GET USER
export const fetchUser = () => async (dispatch, getState) => {
	try {
		const uid = getState().firebase.auth.uid;
		const snapshot = firebase.database().ref(`users/${uid}`);
		snapshot.on('value', snapshot => {
			const user = snapshot.val();
			console.log('USER 0', user);
			user.id = snapshot.key;
			const chatrooms = Object.keys(user.chatrooms);
			user.chatrooms = chatrooms;
			delete user.contacts;
			console.log('USER', user);
			dispatch(getUser(user));
			return true;
		});
	} catch (err) {
		console.log('Error adding new contact: ', err);
	}
};

// UPDATE USERNAME
export const putUserName = (firstName, lastName) => async (dispatch, getState) => {
	try {
		const uid = getState().firebase.auth.uid;
		const fullName = `${firstName} ${lastName}`;
		await firebase.database().ref('/users/' + uid).update({ name: fullName });
		dispatch(updateUserName(fullName));
	} catch (err) {
		console.error(err);
	}
};

// UPDATE LANGUAGE
export const putLang = lang => async (dispatch, getState) => {
	try {
		const uid = getState().firebase.auth.uid;
		await firebase.database().ref('/users/' + uid).update({ language: lang });
		dispatch(updateLang(lang));
	} catch (err) {
		console.error(err);
	}
};

// ADD NEW CHATROOM
export const addNewChatroom = (chatId, uid) => async () => {
	try {
		// check if user has chatrooms node
		usersRef.child(uid).once('value', user => {
			if (user.child('chatrooms').exists()) {
				// if chatrooms node exists, update with current chatId
				db.ref(`users/${uid}`).child('chatrooms').update({ [chatId]: true });
			} else {
				// if chatrooms node doesn't exist, set it with current chatId
				db.ref(`users/${uid}`).child('chatrooms').set({ [chatId]: true });
			}
		});
	} catch (err) {
		console.log('Error adding new chatroom: ', err);
	}
};

// GET ALL CONTACTS
export const fetchContacts = () => async (dispatch, getState) => {
	try {
		const uid = getState().firebase.auth.uid;
		let allContacts = [];
		let promises = [];

		// get current user from firebase
		let user = await db.ref(`users/${uid}`).once('value');
		// for each user contact, get additional info from their user node
		Object.keys(user.val().contacts).forEach(contactId => {
			console.log('CONTACT SNA 0', contactId);
			// push to array of promises
			promises.push(
				db.ref(`users/${contactId}`).once('value', snapshot => {
					let newContact = snapshot.val();
					console.log('CONTACT SNAPS', newContact);
					newContact.id = snapshot.key;
					allContacts.push(newContact);
				})
			);
		});

		// wait for promises to resolve before dispatching getContacts
		await Promise.all(promises);
		console.log('PROMISES', promises);
		dispatch(getContacts(allContacts));
		return true;
	} catch (err) {
		console.log('Error fetching contacts: ', err);
	}
};

// ADD NEW CONTACT
export const addNewContact = ({ name, email }, navigation) => async (dispatch, getState) => {
	const errMsg = 'Please provide a valid name and/or email';
	try {
		const uid = getState().firebase.auth.uid;
		const userRef = db.ref(`users/${uid}`);
		let snapshot = {};

		if (name) {
			const formattedName = formatNameHelper(name);
			// check if user exists using name from add contact form
			snapshot = await usersRef.orderByChild('name').equalTo(formattedName).once('value');
		} else if (email) {
			// check if user exists using email from add contact form
			snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
		}

		// if user exists, add to current user's contacts
		if (snapshot) {
			let id = Object.keys(snapshot.val())[0];
			let contact = snapshot.val()[id];
			contact.id = id;
			userRef
				.child('contacts')
				.update({ [id]: snapshot.val()[id].name })
				.then(() => {
					// add contact in redux store then navigate to all contacts screen
					dispatch(addContact(contact));
					navigation.navigate('Contact');
				})
				.catch(error => dispatch(addContactError(errMsg)));
		} else {
			// send error (contact doesn't exist)
			dispatch(addContactError(errMsg));
		}
	} catch (err) {
		console.log('Error adding new contact: ', err);
		dispatch(addContactError(errMsg));
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
	addContactError: ''
};

// ---------- REDUCER ---------- //
const userReducer = (state = defaultUser, action) => {
	switch (action.type) {
		case GET_USER:
			return {
				...state,
				...action.user
			};
		case UPDATE_USER_NAME:
			return { ...state, name: action.name };
		case UPDATE_LANG:
			return { ...state, language: action.lang };
		case GET_CONTACTS:
			console.log('IN GET CONTACTS', state);
			return { ...state, contacts: action.contacts };
		case ADD_CONTACT:
			return {
				...state,
				contacts: [ ...state.contacts, action.contact ]
			};
		case ADD_CONTACT_ERROR:
			return { ...state, addContactError: action.message };
		default:
			return state;
	}
};
export default userReducer;
