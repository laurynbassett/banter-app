import {auth} from '../Firebase'

export function memberNameHelper(membersArr) {
  return membersArr.filter((name) => name !== auth.currentUser.displayName)
}

export function memberIdHelper(membersArr, contacts) {
	return membersArr.filter(id => id !== auth.currentUser.uid);
}

export function memberImgHelper(membersArr, contacts) {
  return membersArr.reduce((arr, id) => {
    if (id !== auth.currentUser.uid) {
      const contact = contacts && contacts.find((contact) => contact.id === id)
      arr.push(
        contact
          ? contact.imageUrl
            ? contact.imageUrl
            : 'undefined'
          : 'undefined'
      )
    }
    return arr
  }, [])
}
