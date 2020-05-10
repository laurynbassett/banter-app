import firebase, { auth, db } from '../Firebase';
const membersRef = db.ref('members');

// ---------- ACTION TYPES ---------- //
const ADD_MEMBERS = 'ADD_MEMBERS';

// ---------- ACTION CREATORS ---------- //
const addMembers = members => ({ type: ADD_MEMBERS, members });

// ---------- THUNK CREATORS ---------- //
export const addNewMembers = members => async (dispatch, getState) => {
	try {
		const state = getState();
		const chatId = state.chats.currentChat.currentChatId;
		console.log('ADD NEW MEMBERS PROPS:', members, chatId);
		let newMembers = members.map(memberId => ({ memberId: true }));
		let newMemberChatRef = '';
		membersRef.once('value', snapshot => {
			if (snapshot.child(chatId).exists()) {
				newMemberChatRef = db.ref(`members/${chatId}`);
				members.forEach(memberId => {
					if (!newMemberChatRef.child(memberId).exists()) {
						console.log('GOT PAST CONDITION');
						newMemberChatRef.update({ [memberId]: true });
					}
				});
			} else {
				members.forEach(memberId => {
					membersRef.child(chatId).update({ [memberId]: true });
				});
			}
		});

		let newMemberChatVal = newMemberChatRef.key;
		console.log('NEW MEMBER CHAT VAL: ', newMemberChatVal);
		dispatch(addMembers(newMemberChatVal));
	} catch (err) {
		console.log('Error adding new members: ', err);
	}
};

// ---------- INITIAL STATE ---------- //
const defaultMembers = {
	currentChatMembers: []
};

// ---------- REDUCER ---------- //
const membersReducer = (state = defaultMembers, action) => {
	switch (action.type) {
		case ADD_MEMBERS:
			return { ...state, currentChatMembers: state.members };
		default:
			return state;
	}
};

export default membersReducer;
