import React from 'react';
// import { db } from '../Firebase';
import Fire from '../Firebase';
const FIREBASE_MESSAGES_REF = Fire.shared.ref;

// ---------- ACTION TYPES ---------- //
const GET_MESSAGES = 'GET_MESSAGES';
const POST_MESSAGE = 'POST_MESSAGE';

// ---------- ACTION CREATORS ---------- //

const getMessages = messages => ({ type: GET_MESSAGES, messages });
const postMessage = message => ({ type: POST_MESSAGE, message });

// ---------- THUNK CREATORS ---------- //
export const fetchMessages = () => async dispatch => {
	try {
		const messages = await FIREBASE_MESSAGES_REF.limitToLast(20).on('value', snapshot =>
			dispatch(getMessages(snapshot.val()))
		);
		dispatch(getMessages(messages));
	} catch (err) {
		console.error(err);
	}
};

export const sendMessage = message => async dispatch => {
	try {
		console.log('MESSAGE REDUCER: ', message);
		console.log('MESSAGE USER: ', message.message.user);

		// const { uid, user, message, timestamp } = message;
		const ref = await FIREBASE_MESSAGES_REF.push().set(message);
		console.log('SEND MESSAGE REF', ref);
		dispatch(postMessage(message));
	} catch (err) {
		console.error(err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultMessages = {
	messages: []
};

// ---------- REDUCER ---------- //
const messagesReducer = (state = defaultMessages, action) => {
	switch (action.type) {
		case GET_MESSAGES:
			return { ...state, messages: action.messages };
		case POST_MESSAGE:
			return { ...state };
		default:
			return state;
	}
};

export default messagesReducer;
