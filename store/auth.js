import React from "react";

import { auth, db } from "../Firebase";

const SET_USER = "SET_USER";

const setUser = (user) => ({ type: SET_USER, user });

export const signUpWithEP = (
  email,
  password,
  firstName,
  lastName,
  language
) => {
  return async (dispatch) => {
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);

      if (user) {
        // console.log("NEW USER CREATED: ", email, password, user);
        await db.ref("/users/").push({
          email: email,
          name: `${firstName} ${lastName}`,
          language: language,
          created_at: Date.now(),
        });
      }
      await auth.signInWithEmailAndPassword(email, password);
      // console.log("user object", user);
      dispatch(setUser(user));
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
      const user = await auth.signInWithEmailAndPassword(email, password);
      dispatch(setUser(user));
    } catch (err) {
      const errMessage = err.message;
      console.log("Login Error: ", errMessage);
    }
  };
};

// Auth Logout
export const logout = () => {
  try {
    auth.signOut();
    console.log("USER LOGGED OUT");
    return true;
  } catch (err) {
    const errMessage = err.message;
    console.log("Logout Error: ", errMessage);
  }
};

// Check Login
export const checkLogin = () => {
  try {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("USER IS LOGGED IN");
        return true;
      } else {
        console.log("USER IS LOGGED OUT");
        return false;
      }
    });
  } catch (err) {
    console.log("Login Check Error: ", err);
  }
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

// // User Info
// export const getUser = () => {
//   const { deviceId, deviceName, platform } = Constants;
//   return { deviceId, deviceName, platform };
// };

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}
