export default function formatText(props) {
  const { currentChat, displayName, route, uid } = props;
  console.log("FORMATTEXT PROPS", props);
  const contactId = route.params.contactId || Object.keys(currentChat.members);
  const contactName = route.params.name || Object.values(currentChat.members);
  const timestamp = Date.now();
  const currChatId = currentChat ? currentChat.id : "";

  return { contactId, contactName, uid, displayName, timestamp, currChatId };
}
