import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { firebaseReducer } from "react-redux-firebase";

// ---------- REDUCER---------- //
const reducer = combineReducers({
  firebase: firebaseReducer,
});

// ---------- MIDDLEWARE ---------- //
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

// ---------- STORE ---------- //
const store = createStore(reducer, middleware);

export default store;
export * from "./auth";
