export default function formatText(text) {
	const { currentChat, displayName, route, uid } = text;

	const contactId = route.params.contactId || Object.keys(this.props.currentChat.members);
	const contactName = route.params.name || Object.values(this.props.currentChat.members);
	const timestamp = Date.now();
	const currChatId = currentChat ? currentChat.id : "";

	return { contactId, contactName, uid, displayName, timestamp, currChatId };
}
