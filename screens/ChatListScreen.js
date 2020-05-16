import React from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';

import { ChatListItem } from '../components';
import { fetchAllChats, setCurrentChat, fetchUser } from '../store';
class ChatListScreen extends React.Component {
	componentDidMount() {
		this.props.fetchUser();
		this.props.fetchAllChats();
	}

	render() {
		console.log('DONE MOUNTING', this.props.user);
		return (
			<FlatList
				data={this.props.chats}
				renderItem={({ item }) => (
					<ChatListItem
						navigation={this.props.navigation}
						setCurrentChat={this.props.setCurrentChat}
						item={item}
					/>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}
}

const mapState = state => ({
	chats: state.chats.chats,
	userId: state.firebase.auth.uid,
	user: state.user
});

const mapDispatch = dispatch => ({
	fetchUser: () => dispatch(fetchUser()),
	fetchAllChats: () => dispatch(fetchAllChats()),
	setCurrentChat: chatId => dispatch(setCurrentChat(chatId))
});

export default connect(mapState, mapDispatch)(ChatListScreen);
