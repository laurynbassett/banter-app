import React from 'react';
import { connect } from 'react-redux';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { GoogleAuthData } from 'expo-google-sign-in';

import firebase, { auth, db } from '../Firebase';
import ChatListItem from '../components/ChatListItem';
import { fetchAllChats, setCurrentChat } from '../store/chats';

const dummyData = [
	{
		id: '5',
		title: 'Isra',
		lastMessage: 'Jacob: yo whats up'
	},
	{
		id: '4',
		title: 'Group Chat',
		lastMessage: 'Jacob: hello'
	},
	{
		id: '3',
		title: 'Lauryn',
		lastMessage: 'Lauryn: Ok sounds great'
	}
];

class ChatListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.goToSingleChat = this.goToSingleChat.bind(this);
	}

	componentDidMount() {
		this.props.fetchAllChats();
	}

	goToSingleChat(chatRoomId) {
		console.log('yes', this.props);
		this.props.navigation.navigate(
			'SingleChat',
			(params: {
				chatRoomId: chatRoomId
			})
		);
	}

	render() {
		console.log('RENDER', this.props.chatrooms);
		return (
			<FlatList
				data={this.props.chatrooms}
				renderItem={({ item }) => <ChatListItem item={item} goToSingleChat={this.goToSingleChat} />}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}
}

const mapState = state => ({
	chatrooms: state.user.chatrooms
});

const mapDispatch = dispatch => ({
	fetchAllChats: () => dispatch(fetchAllChats())
});

export default connect(mapState, mapDispatch)(ChatListScreen);
