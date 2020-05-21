export default function formatText(props) {
  const {currentChat, displayName, route, uid} = props

  // console.log("ROUTE", Object.keys(this.props.currentChat.members));
  // {contact1: test khan, contact2: jane doe}
  // Change to an object or an array of contactIds
  const contactId =
    route.params.contactId || Object.keys(this.props.currentChat.members)

  // Change to object or an array of contact Names --- may need to combine
  // id and name into 1
  const contactName = route.params.name || Object.values(currentChat.members)
  const timestamp = Date.now()
  const currChatId = currentChat ? currentChat.id : ''

  return {contactId, contactName, uid, displayName, timestamp, currChatId}
}
