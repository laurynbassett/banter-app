import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';

import Fire, { auth, db } from '../Firebase';
import Layout from '../constants/Layout';
import { fetchMessages, postMessage, subscribeToMessages } from '../store/messages';
class SingleChat extends Component {
	static navigationOptions = {
		header: 'SINGLE'
	};

	async componentDidMount() {
		console.log('SINGLE CHAT PROPS', this.props);
		// fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
		await this.props.fetchMessages();
		console.log('FETCHED MESSAGES - PROPS*****', this.props);
	}

	handleSendMessage(messages) {
		console.log('HANDLE SEND MSG: ', messages);
		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));
		const { uid, displayName } = auth.currentUser;
		const { contactId } = this.props.route.params;
		const message = messages[messages.length - 1].text;
		const timestamp = Date.now();
		this.props.sendMessage({ uid, displayName, contactId, message, timestamp });
	}

	render() {
		return (
			<View style={styles.container}>
				<GiftedChat
					messages={this.props.messages}
					user={{
						_id: this.props.firebase.uid,
						name: this.props.firebase.displayName
					}}
					onSend={this.handleSendMessage}
					alignTop={true}
					isTyping={true}
					showUserAvatar={true}
					showAvatarForEveryMessage={true}
					placeholder='Type a message...'
				/>
			</View>
		);
	}
}

const mapState = state => ({
	messages: state.messages.messages,
	firebase: state.firebase.auth,
	currentChat: state.chats.currentChat
});

const mapDispatch = dispatch => ({
	fetchMessages: () => dispatch(fetchMessages()),
	sendMessage: msg => dispatch(postMessage(msg))
});

export default connect(mapState, mapDispatch)(SingleChat);

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fafafa',
		width: Layout.window.width,
		height: Layout.window.height * 0.8
	},
	headerContainer: {
		flexDirection: 'row',
		backgroundColor: '#fafafa',
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 4,
		paddingBottom: 4
	}
});
