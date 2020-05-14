import { auth, db } from "../Firebase";
import * as Google from "expo-google-app-auth";
import { GOOGLE_IOS_CLIENT_ID } from "react-native-dotenv";
import firebase from "firebase/app";

const SET_USER_LOGIN = "SET_USER_LOGIN";

const setUserLogin = (isLoggedIn) => ({ type: SET_USER_LOGIN, isLoggedIn });

export const signUpWithEP = (
  email,
  password,
  firstName,
  lastName,
  language
) => {
  return async (dispatch) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (user) {
        // console.log("NEW USER CREATED: ", email, password, user);
        await db.ref("/users/" + user.uid).set({
          email: email,
          name: `${firstName} ${lastName}`,
          language: language,
          created_at: Date.now(),
        });
      }
      await auth.signInWithEmailAndPassword(email, password);

      dispatch(setUserLogin(true));
    } catch (err) {
      const errMessage = err.message;
      console.log("Signup Error: ", errMessage);
    }
  };
};

// Email Password Login
export const loginWithEP = (email, password) => {
  return async (dispatch) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      dispatch(setUserLogin({ isLoggedIn: true }));
    } catch (err) {
      const errMessage = err.message;
      console.log("Login Error: ", errMessage);
    }
  };
};

export const loginWithGoogle = () => {
  return async (dispatch) => {
    try {
      const result = await Google.logInAsync({
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        console.log("LoginScreen.js.js 21 | ", result.user.givenName);
        const user = onSignIn(result);
        console.log("what is being returned from onSignIn", user);

        dispatch(setUserLogin({ isLoggedIn: true }));
      }
    } catch (e) {
      console.log("LoginScreen.js.js 30 | Error with login", e);
      return { error: true };
    }
  };
};

const onSignIn = (googleUser) => {
  console.log("Google Auth Response", googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );
      // Sign in with credential from the Google user.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          console.log("user signed in ");
          if (result.additionalUserInfo.isNewUser) {
            firebase
              .database()
              .ref("/users/" + result.user.uid)
              .set({
                email: result.user.email,
                name: `${result.additionalUserInfo.profile.given_name} ${result.additionalUserInfo.profile.family_name}`,
                created_at: Date.now(),
              })
              .then(function (snapshot) {
                console.log("Snapshot", snapshot);
              });
          } else {
            firebase
              .database()
              .ref("/users/" + result.user.uid)
              .update({
                last_logged_in: Date.now(),
              });
          }
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorCode, ": ", errorMessage);
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          console.log("email: ", email, "credentials: ", credential);
        });
    } else {
      console.log("User already signed-in Firebase.");
    }
  });
};

const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

// Check Errors
export const checkErrors = (email, password) => {
  switch ((email, password)) {
    case email === "" && password === "":
      return console.log("empty email and password");
    case email !== "" && password === "":
      return console.log("empty password");
    case email === "" && password !== "":
      return console.log("empty email");
    default:
      return console.log("no errors");
  }
};

// Google Auth Credits: https://github.com/nathvarun/Expo-Google-Login-Firebase/tree/master
// including firebase in import: https://stackoverflow.com/questions/39204923/undefined-is-not-an-object-firebase-auth-facebookauthprovider-credential
