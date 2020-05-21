import {auth} from '../Firebase'

export function memberNameHelper(membersArr) {
  return membersArr.filter((name) => name !== auth.currentUser.displayName)
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
  var success = arrayOfMembers.every(function (val) {
    return groupChatContacts.indexOf(val) !== -1
  })

  const successArray = arrayOfMembers.map((member) => {
    if (groupChatContacts.includes(member)) {
      return true
    } else {
      return false
    }
  })

  console.log('SUCCESSARRAY', successArray)

  if (
    successArray.includes(false) ||
    arrayOfMembers.length !== groupChatContacts.length
  ) {
    return false
  } else {
    return true
  }

  // return success
}
