import firebase, { auth, db } from '../Firebase';
const users = db.ref('users');

// ---------- ACTION TYPES ---------- //
const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';

// ---------- ACTION CREATORS ---------- //
const getUser = user => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });

// ---------- THUNK CREATORS ---------- //

// ---------- INITIAL STATE ---------- //
const defaultUser = {};

// ---------- REDUCER ---------- //
const userReducer = (state = defaultUser, action) => {
	switch (action.type) {
		case GET_USER:
			return action.user;
		case REMOVE_USER:
			return defaultUser;
		default:
			return state;
	}
};

export default userReducer;
