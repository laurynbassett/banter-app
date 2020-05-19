import firebase from "firebase/app";
// // import 'firebase/analytics';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_DATABASE_URL,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_APP_ID,
	FIREBASE_MEASUREMENT_ID
} from "react-native-dotenv";

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
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// firebase.analytics();
export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage();

export default firebase;
