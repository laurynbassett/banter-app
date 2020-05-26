export default function formatText(props) {
  const {currentChat, displayName, route, uid} = props
  const contacts = route.params.contacts

  // Change to object or an array of contact Names --- may need to combine
  // id and name into 1
  const timestamp = Date.now()
  const currChatId = currentChat.id || ''

  return {uid, displayName, contacts, currChatId, timestamp}
}
