import { auth } from '../Firebase';

export default function memberHelper(membersArr) {
	return membersArr.filter(name => name !== auth.currentUser.displayName);
}
