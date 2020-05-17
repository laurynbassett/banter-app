import React from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';

import { ChatListItem } from '../components';
import { fetchChats, fetchContacts, setCurrentChat, fetchUser } from '../store';
class ChatListScreen extends React.Component {
	componentDidMount() {
		this.props.fetchUser();
		this.props.fetchContacts();
		this.props.fetchChats();
	}

	render() {
		return this.props.user.getContactsSuccess ? (
			<FlatList
				data={this.props.chats}
				renderItem={({ item }) => (
					<ChatListItem
						navigation={this.props.navigation}
						setCurrentChat={this.props.setCurrentChat}
						item={item}
						contacts={this.props.user.contacts}
					/>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		) : null;
	}
}

const mapState = state => ({
	chats: state.chats.chats,
	userId: state.firebase.auth.uid,
	user: state.user
});

const mapDispatch = dispatch => ({
	fetchUser: () => dispatch(fetchUser()),
	fetchChats: () => dispatch(fetchChats()),
	fetchContacts: () => dispatch(fetchContacts()),
	setCurrentChat: chatId => dispatch(setCurrentChat(chatId))
});

export default connect(mapState, mapDispatch)(ChatListScreen);
