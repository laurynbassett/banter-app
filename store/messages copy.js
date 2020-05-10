// import React from 'react';
// import base64 from 'base-64';
// import firebase, { auth, db } from '../Firebase';
// const messages = db.ref('messages');

// const USER_REF = Fire.shared.userRef;
// const MESSAGES_REF = Fire.shared.messagesRef;
// const CHATS_REF = Fire.shared.chatsRef;
// const CHATS_BY_USER_REF = Fire.shared.chatroomsRef;
// const MEMBERS_REF = Fire.shared.membersRef;

// // ---------- ACTION TYPES ---------- //
// export const GET_CONTACT_MESSAGES = 'GET_CONTACT_MESSAGES';
// export const GET_CONTACT_CHAT_ID = 'GET_CONTACT_CHAT_ID';
// export const SEND_MESSAGE = 'SEND_MESSAGE';
// export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'

// // ---------- ACTION CREATORS ---------- //

// const getAllMessages = messages => ({ type: GET_ALL_MESSAGES, messages });
// const getContactMessages = messages => ({ type: GET_CONTACT_MESSAGES, messages });
// const getContactChatId = id => ({ type: GET_CONTACT_CHAT_ID, id });
// const sendMessage = (message, user) => ({ type: POST_MESSAGE, message });

// // ---------- THUNK CREATORS ---------- //

// // how to handle case of one user deleting chat then other user sending new text from deleted chat

// // get all messages for current user
// // export const fetchAllMessages = () => async dispatch => {
// // 	try {
// // 		let chatIds = [];
// // 		const chatsByUserRef = CHATS_BY_USER_REF.child(UID);
// // 		chatsByUserRef.on('value', snapshot => {
// // 			chatIds.concat(Object.keys(snapshot.val()));
// // 		});
// // 		console.log('************FETCHED chatIds: ', chatIds);
// // 		dispatch(getAllMessages(messages));
// // 	} catch (err) {
// // 		console.error(err);
// // 	}
// // };

// // get all messages with a certain contact
// // only works for 1-1 convos (not group)
// export const fetchContactMessages = (UID, contactId) => async dispatch => {
// 	try {
// 		let userChats = [];
// 		let contactChat = '';
// 		// console.log('UID', UID);
// 		// console.log('FETCH CONTACT MESSAGES', contactId);
// 		// console.log('CHATS_BY_USER_REF', CHATS_BY_USER_REF);
// 		// populate array of user's chats (ids)
// 		CHATS_BY_USER_REF.once('value', snapshot => {
// 			snapshot.forEach(childSnapshot => {
// 				if (childSnapshot.key === UID) {
// 					userChats = userChats.concat(Object.keys(childSnapshot.val()));
// 				}
// 				if (childSnapshot.key === contactId) {
// 					contactChat = Object.keys(childSnapshot.val()).find(id => userChats.includes(id));
// 				}
// 			});

// 			if (contactChat) {
// 				MESSAGES_REF.child(contactChat).limitToLast(20).on('value', snapshot => {
// 					let messages = [];
// 					const obj = snapshot.key;
// 					console.log('SNAP', obj);
// 					for (let id in obj) {
// 						let newObj = obj[id];
// 						messages.push({
// 							_id: newObj.timestamp,
// 							text: newObj.message,
// 							timestamp: new Date(newObj.timestamp),
// 							user: { _id: newObj._sender }
// 						});
// 					}
// 					// console.log('messages***********', messages);
// 					dispatch(getContactMessages(messages));
// 					dispatch(getContactChatId(contactChat));
// 				});
// 			}
// 		});
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// export const sendMessage = text => async dispatch => {
// 	try {
// 		console.log('**********MESSAGE REDUCER: ', text);
// 		console.log('********UID', text.uid);
// 		const { uid, contactId, message, timestamp } = text;
// 		let messageRef = '';
// 		let chatRef = text.chatId ? CHATS_REF.child(text.chatId) : '';

// 		if (!chatRef) {
// 			chatRef = CHATS_REF.push();
// 			console.log('CHATREF', chatRef);
// 			const userChatroomRef = CHATS_BY_USER_REF.child(uid).set({
// 				[chatRef.key]: true
// 			});
// 			console.log('userChatroomRef', userChatroomRef);

// 			const contactChatroomRef = CHATS_BY_USER_REF.child(contactId).set({ [chatRef.key]: true });
// 			MEMBERS_REF.child(chatRef.key).set({ [uid]: true, [contactId]: true });
// 			console.log('contactChatroomRef', contactChatroomRef);
// 		}
// 		chatRef.set({ lastMessage: `${uid}: ${message}`, timestamp: timestamp });
// 		MESSAGES_REF.child(chatRef.key).push({ message: message, sender: contactId, timestamp: timestamp });

// 		console.log('SEND MESSAGE REF', messageRef);
// 		console.log('CHAT REF', chatRef);

// 		dispatch(fetchContactMessages(contactId));
// 		dispatch(getContactChatId(chatRef.key));
// 		console.log('DISPATCHED FETCH CONTACT MESSAGES!');
// 	} catch (err) {
// 		console.error('Error pushing to db: ', err);
// 	}
// };

// // ---------- INITIAL STATE ---------- //
// const defaultMessages = {
// 	messages: [],
// 	singleChat: [],
// 	singleChatId: ''
// };

// // ---------- REDUCER ---------- //
// const messagesReducer = (state = defaultMessages, action) => {
// 	switch (action.type) {
// 		case GET_ALL_MESSAGES:
// 			return { ...state, messages: action.messages };
// 		case GET_CONTACT_MESSAGES:
// 			return { ...state, singleChat: action.messages };
// 		case GET_CONTACT_CHAT_ID:
// 			return { ...state, singleChatId: action.id };
// 		// case SEND_MESSAGE:
// 		// 	return { ...state };
// 		default:
// 			return state;
// 	}
// };

// export default messagesReducer;

// class Fire {
// 	// constructor() {
// 	// 	this.init();
// 	// 	this.observeAuth();
// 	// }

// 	// init = () => {
// 	// 	if (!firebase.apps.length) {
// 	// 		firebase.initializeApp({
// 	// 			apiKey: 'AIzaSyDZJZm9TgdBItFu1agAWryuKHWXv8og4pE',
// 	// 			authDomain: 'stachka-example.firebaseapp.com',
// 	// 			databaseURL: 'https://stachka-example.firebaseio.com',
// 	// 			projectId: 'stachka-example',
// 	// 			storageBucket: 'stachka-example.appspot.com',
// 	// 			messagingSenderId: '907316643379'
// 	// 		});
// 	// 	}
// 	// };

// 	// observeAuth = () => firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

// 	// onAuthStateChanged = user => {
// 	// 	if (!user) {
// 	// 		try {
// 	// 			firebase.auth().signInAnonymously();
// 	// 		} catch ({ message }) {
// 	// 			alert(message);
// 	// 		}
// 	// 	}
// 	// };

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
