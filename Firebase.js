// import firebase from 'firebase/app';
// // import 'firebase/analytics';
// import 'firebase/auth';
// import 'firebase/database';
import firebase from 'firebase'; // 4.8.1

import {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_DATABASE_URL,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_APP_ID,
	FIREBASE_MEASUREMENT_ID
} from 'react-native-dotenv';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: FIREBASE_DATABASE_URL,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
	measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// export const Firebase = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// reference to db messages
// get messagesRef() {
// 	return firebase.database().ref('messages');
// }

// subscribe to db messages
// on(cb) {
// 	this.ref.limitToLast(20).on('child_added', snapshot => cb(this.parse(snapshot)));
// }

// unsubscribe from db messages
// off() {
// 	this.ref.off();
// }

// current user id
// get uid() {
// 	return auth.currentUser.uid;
// }

// timestamp
// get timestamp() {
// 	return Date.now();
// }

// firebase.analytics();
// export const db = firebase.database();
// export const auth = firebase.auth();

class Fire {
	constructor() {
		this.init();
		this.observeAuth();
	}

	init = () => {
		if (!firebase.apps.length) {
			firebase.initializeApp({
				apiKey: 'AIzaSyDZJZm9TgdBItFu1agAWryuKHWXv8og4pE',
				authDomain: 'stachka-example.firebaseapp.com',
				databaseURL: 'https://stachka-example.firebaseio.com',
				projectId: 'stachka-example',
				storageBucket: 'stachka-example.appspot.com',
				messagingSenderId: '907316643379'
			});
		}
	};

	observeAuth = () => firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

	onAuthStateChanged = user => {
		if (!user) {
			try {
				firebase.auth().signInAnonymously();
			} catch ({ message }) {
				alert(message);
			}
		}
	};

	get user() {
		return firebase.auth().currentUser;
	}

	get uid() {
		return (firebase.auth().currentUser || {}).uid;
	}

	get ref() {
		return firebase.database().ref('messages');
	}

	parse = snapshot => {
		const { timestamp: numberStamp, text, user } = snapshot.val();
		const { key: _id } = snapshot;
		const timestamp = new Date(numberStamp);
		const message = {
			_id,
			timestamp,
			text,
			user
		};
		return message;
	};

	on = callback => this.ref.limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));

	get timestamp() {
		return firebase.database.ServerValue.TIMESTAMP;
	}
	// send the message to the Backend
	send = messages => {
		for (let i = 0; i < messages.length; i++) {
			const { text, user } = messages[i];
			const message = {
				text,
				user,
				timestamp: this.timestamp
			};
			this.append(message);
		}
	};

	append = message => this.ref.push(message);

	// close the connection to the Backend
	off() {
		this.ref.off();
	}
}

Fire.shared = new Fire();
export default Fire;
