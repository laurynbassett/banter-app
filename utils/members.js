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
  var success = groupChatContacts.every(function (val) {
    return arrayOfMembers.indexOf(val) !== -1
  })

  return success
}
