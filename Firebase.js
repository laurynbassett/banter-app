import fBaseCreds from "./.firebase";
import * as firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: fBaseCreds.apiKey,
  authDomain: fBaseCreds.authDomain,
  databaseURL: fBaseCreds.databaseURL,
  projectId: fBaseCreds.projectId,
  storageBucket: fBaseCreds.storageBucket,
  messagingSenderId: fBaseCreds.messagingSenderId,
  appId: fBaseCreds.appId,
  measurementId: fBaseCreds.measurementId,
};
// Initialize Firebase
export const Firebase = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.database();
export const auth = firebase.auth();
