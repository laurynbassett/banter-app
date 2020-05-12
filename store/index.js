import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import chatsReducer from './chats';
import messagesReducer from './messages';
import userReducer from './user';

// ---------- REDUCER---------- //
const reducer = combineReducers({
	chats: chatsReducer,
	messages: messagesReducer,
	user: userReducer
});

// ---------- MIDDLEWARE ---------- //
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware));

// ---------- STORE ---------- //
const store = createStore(reducer, middleware);

export default store;
export * from './chats';
export * from './messages';
export * from './user';
