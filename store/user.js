import firebase, { auth, db } from '../Firebase';
const users = db.ref('users');

// ---------- ACTION TYPES ---------- //
const GET_USER = 'GET_USER';

const ADD_CONTACT = 'ADD_CONTACT';

// ---------- ACTION CREATORS ---------- //
const getUser = user => ({ type: GET_USER, user });

const addContact = contact => ({ type: ADD_CONTACT, contact });

// ---------- THUNK CREATORS ---------- //

// export const addNewContact = contact => async (dispatch, getState) => {
// 	try {
// 		const uid = auth.currentUser.uid
// 		db.ref(`users/${uid}`).once('value', snapshot => {
// 			if (snapshot.val()) {
// 				snap
// 			}
// 		})

// 	} catch (err) {
// 		console.log('Error adding new contact: ', err)
// 	}
// }

// ---------- INITIAL STATE ---------- //
const defaultUser = {
	name: '',
	email: '',
	unseenCount: null,
	contacts: []
};

// ---------- REDUCER ---------- //
const userReducer = (state = defaultUser, action) => {
	switch (action.type) {
		case GET_USER:
			return action.user;
		default:
			return state;
	}
};

export default userReducer;
