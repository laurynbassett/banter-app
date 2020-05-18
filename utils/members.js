import { auth } from '../Firebase';

export default function memberHelper(membersArr) {
	return membersArr.filter(name => name !== auth.currentUser.displayName);
}

export function memberIdHelper(membersArr, contacts) {
	return membersArr.filter(id => id !== auth.currentUser.uid);
}
