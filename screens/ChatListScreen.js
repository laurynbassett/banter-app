import React from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';

import ChatListItem from '../components/ChatListItem';
import { fetchAllChats, setCurrentChat } from '../store/chats';
import { fetchUser, fetchChatrooms } from '../store/user';

class ChatListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.goToSingleChat = this.goToSingleChat.bind(this);
	}

	componentDidMount() {
		this.props.fetchUser();
		this.props.fetchChatrooms();
		this.props.fetchAllChats();
	}

	goToSingleChat(chatId) {
		// set current chatroom in redux
		this.props.setCurrentChat(chatId);

		// navigate to single chat page
		this.props.navigation.navigate('SingleChat');
	}

	render() {
		console.log('RENDER', this.props.chatrooms);
		return (
			<FlatList
				data={this.props.chats}
				renderItem={({ item }) => <ChatListItem item={item} goToSingleChat={this.goToSingleChat} />}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}
}

const mapState = state => ({
	chats: state.chats.chats
});

const mapDispatch = dispatch => ({
	fetchUser: () => dispatch(fetchUser()),
	fetchChatrooms: () => dispatch(fetchChatrooms()),
	fetchAllChats: () => dispatch(fetchAllChats()),
	setCurrentChat: chatId => dispatch(setCurrentChat(chatId))
});

export default connect(mapState, mapDispatch)(ChatListScreen);
