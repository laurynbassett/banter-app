import React from 'react';
import base64 from 'base-64';

import firebase, { auth, db } from '../Firebase';
import { createCurrentChatId } from './chats';
import { addNewChatroom } from './chatrooms';
import { addNewMembers } from './members';

const messagesRef = db.ref('messages');
const chatsRef = db.ref('chats');

// ---------- ACTION TYPES ---------- //
export const GET_ALL_MESSAGES = 'GET_ALL_MESSAGES';
export const GET_CURRENT_CHAT_MESSAGES = 'GET_CURRENT_CHAT_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

// ---------- ACTION CREATORS ---------- //

const getAllMessages = messages => ({ type: GET_ALL_MESSAGES, messages });
const getCurrentChatMessages = messages => ({ type: GET_CURRENT_CHAT_MESSAGES, messages });
const sendMessage = (message, user) => ({ type: SEND_MESSAGE, message });
const receiveMessage = message => ({ type: RECEIVE_MESSAGE, message });

// ---------- THUNK CREATORS ---------- //
export const fetchCurrentChatMessages = () => async (dispatch, getState) => {
	try {
		let messages = [];
		const state = getState();
		console.log('FETCH CURRCHAT MSGS STATE: ', state);
		if (state.chats.currentChatId) {
			db.ref(`messages/${state.chats.currentChatId}`).once('value', currentChatMessages => {
				console.log('FETCH CURRENT MSGS - MSGS: ', currentChatMessages);
				currentChatMessages.forEach(msg => {
					const messageId = msg.key;
					const message = messageId.child('message').val();
					const senderId = messageId.child('sender').val();
					const timestamp = messageId.child('timestamp').val();
					msgObj = { id: messageId, message, senderId, timestamp };
					console.log('MESSAGE OBJ: ', msgObj);
					messages.push(msgObj);
				});
			});
		}
		console.log('MESSAGES FROM QUERY: ', messages);
		dispatch(getCurrentChatMessages(messages));
	} catch (err) {
		console.error('Error getting current chat messages: ', err);
	}
};

export const postMessage = text => async (dispatch, getState) => {
	try {
		const { uid, contactId, message, timestamp } = text;
		console.log('TEXT***', text);
		const state = getState();
		console.log('POST MESSAGE STATE: ', state);
		let chatId = '';
		if (!state.chats.currentChat.currentChatId) {
			chatId = await dispatch(createCurrentChatId());
			console.log('POST MESSAGE STATE AFTER CREATE CHAT ID: ', state);
			console.log('CHATID', chatId);
			await dispatch(addNewChatroom(uid));
			console.log('ADDED NEW USER CHATROOM');
			await dispatch(addNewChatroom(contactId));
			console.log('POST MESSAGE STATE AFTER CREATE CHATROOM: ', state);
			await dispatch(addNewMembers([ uid, contactId ]));
			console.log('ADDED NEW MEMBERS');
		} else {
			chatId = state.chats.currentChat.currentChatId;
		}
		const currChatRef = db.ref(`messages/${chatId}`);
		chatsRef.child(chatId).set({
			lastMessage: `${uid}: ${message}`,
			sender: uid,
			timestamp
		});
		currChatRef.push().set({
			message,
			sender: uid,
			timestamp
		});
		await dispatch(fetchCurrentChatMessages());
		console.log('DISPATCHED ADD NEW MESSAGE!');
	} catch (err) {
		console.error('Error adding msg to db: ', err);
	}
};

export const subscribeToMessages = () => async dispatch => {
	try {
		messages.on('child_added', data => dispatch(receiveMessage(data.val())));
	} catch (err) {
		console.error('Error subscribing to messages: ', err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultMessages = {
	messages: [],
	currentChatMessages: []
};

// ---------- REDUCER ---------- //
const messagesReducer = (state = defaultMessages, action) => {
	switch (action.type) {
		case GET_ALL_MESSAGES:
			return { ...state, messages: action.messages };
		case GET_CURRENT_CHAT_MESSAGES:
			return { ...state, currentChatMessages: action.messages };
		case SEND_MESSAGE:
			return { ...state };
		case RECEIVE_MESSAGE:
			return { ...state, messages: state.messages.concat(action.message) };
		default:
			return state;
	}
};

export default messagesReducer;

// class Fire {
// constructor() {
// 	this.init();
// 	this.observeAuth();
// }

// init = () => {
// 	if (!firebase.apps.length) {
// 		firebase.initializeApp({
// 			apiKey: 'AIzaSyDZJZm9TgdBItFu1agAWryuKHWXv8og4pE',
// 			authDomain: 'stachka-example.firebaseapp.com',
// 			databaseURL: 'https://stachka-example.firebaseio.com',
// 			projectId: 'stachka-example',
// 			storageBucket: 'stachka-example.appspot.com',
// 			messagingSenderId: '907316643379'
// 		});
// 	}
// };

// observeAuth = () => firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

// onAuthStateChanged = user => {
// 	if (!user) {
// 		try {
// 			firebase.auth().signInAnonymously();
// 		} catch ({ message }) {
// 			alert(message);
// 		}
// 	}
// };

// 	get user() {
// 		return auth.currentUser;
// 	}

// 	get uid() {
// 		return (auth.currentUser || {}).uid;
// 	}

// 	get userRef() {
// 		return db.ref(`users/${this.uid}`);
// 	}

// 	get messagesRef() {
// 		return db.ref('messages');
// 	}

// 	get chatsRef() {
// 		return db.ref('chats');
// 	}

// 	get chatroomsRef() {
// 		return db.ref('chatrooms');
// 	}

// 	get membersRef() {
// 		return db.ref('members');
// 	}

// 	parse = snapshot => {
// 		const { timestamp: numberStamp, text, user } = snapshot.val();
// 		const { key: _id } = snapshot;
// 		const timestamp = new Date(numberStamp);
// 		const message = {
// 			_id,
// 			timestamp,
// 			text,
// 			user
// 		};
// 		return message;
// 	};

// 	on = callback => this.ref.limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));

// 	get timestamp() {
// 		return firebase.database.ServerValue.TIMESTAMP;
// 	}
// 	// send the message to the Backend
// 	send(message) {
// 		for (let i = 0; i < message.length; i++) {
// 			const { text, user } = message[i];
// 			this.messagesRef.push({
// 				text,
// 				user,
// 				timestamp: this.timestamp
// 			});
// 		}
// 	}

// 	// append = message => this.ref.push(message);

// 	// close the connection to the Backend
// 	off() {
// 		this.ref.off();
// 	}
// }

// Fire.shared = new Fire();
// export default Fire;
