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

export function containsAll(arrayOfMembers, groupChatContacts) {
  const successArray = arrayOfMembers.map((member) => {
    if (groupChatContacts.includes(member)) {
      return true
    } else {
      return false
    }
  })

  if (
    successArray.includes(false) ||
    arrayOfMembers.length !== groupChatContacts.length
  ) {
    return false
  } else {
    return true
  }
}

export function createMemberString(membersNameArray) {
  if (membersNameArray.length === 2) {
    return `${membersNameArray[0]} & ${membersNameArray[0]}`
  } else {
    return `${membersNameArray[0]}, ${membersNameArray[1]} & ${
      membersNameArray.length - 2
    } others`
  }
}
