import React from 'react';
import base64 from 'base-64';

import firebase, { auth, db } from '../Firebase';
import { createCurrentChatId, addNewMember } from './chats';
import { addNewChatroom } from './user';

const messagesRef = db.ref('messages');
const chatsRef = db.ref('chats');

// ---------- ACTION TYPES ---------- //
export const GET_MESSAGES = 'GET_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

// ---------- ACTION CREATORS ---------- //

const getMessages = messages => ({ type: GET_MESSAGES, messages });
const sendMessage = (message, user) => ({ type: SEND_MESSAGE, message });
const receiveMessage = message => ({ type: RECEIVE_MESSAGE, message });

// ---------- THUNK CREATORS ---------- //

// for current chat
export const fetchMessages = () => async (dispatch, getState) => {
	try {
		let messages = [];
		const state = getState();
		const chatId = state.chats.currentChat.currentChatId;
		console.log('FETCHMESAGE CHAT ID', chatId);
		if (chatId) {
			// later add .limitToLast
			db.ref(`messages/${chatId}`).on('value', currChatMsgs => {
				console.log('currChatMsgs', currChatMsgs);
				currChatMsgs.forEach(currChatId => {
					const _id = currChatId.key;
					const text = currChatId.child('message').val();
					const createdAt = currChatId.child('timestamp').val();
					const senderId = currChatId.child('senderId').val();
					const name = currChatId.child('senderName').val();
					messages.push({ _id, text, createdAt, user: { _id: senderId, name } });
				});
				dispatch(getMessages(messages));
			});
		}
	} catch (err) {
		console.error('Error getting current chat messages: ', err);
	}
};

export const postMessage = text => async (dispatch, getState) => {
	try {
		const { uid, contactId, displayName, message, timestamp } = text;
		const state = getState();
		let chatId = '';
		if (!state.chats.currentChat.currentChatId) {
			chatId = await dispatch(createCurrentChatId());
			await dispatch(addNewChatroom(chatId, uid));
			await dispatch(addNewChatroom(chatId, contactId));
			await dispatch(addNewMember(chatId, uid));
			await dispatch(addNewMember(chatId, contactId));
		} else {
			chatId = state.chats.currentChat.currentChatId;
		}
		const currChatRef = db.ref(`messages/${chatId}`);
		chatsRef
			.child(chatId)
			.update({
				lastMessage: `${uid}: ${message}`,
				senderId: uid,
				timestamp
			})
			.then(() => {
				currChatRef.push().set({
					message,
					senderId: uid,
					senderName: displayName,
					timestamp
				});
			})
			.then(() => {
				dispatch(fetchMessages());
				console.log('DISPATCHED ADD NEW MESSAGE!');
			})
			.catch(err => console.log('Error posting message to chats and messages', err));
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

const defaultMessages = [];

// ---------- REDUCER ---------- //
const messagesReducer = (state = defaultMessages, action) => {
	switch (action.type) {
		case GET_MESSAGES:
			return action.messages;
		case SEND_MESSAGE:
			return { ...state };
		case RECEIVE_MESSAGE:
			return { ...state, messages: state.messages.concat(action.message) };
		default:
			return state;
	}
};

export default messagesReducer;
