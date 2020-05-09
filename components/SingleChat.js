import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';

// import { auth, db } from '../Firebase';
import { SingleChatHeaderLeft, SingleChatHeaderCenter } from '.';
import { sendMessage } from '../store/messages';
import Fire from '../Firebase';

class SingleChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			messages: []
		};
		this.sendMessage = this.sendMessage.bind(this);
	}

	static navigationOptions = ({ navigation }) => ({
		headerStyle: styles.headerContainer,
		title: SingleChatHeaderCenter,
		headerLeft: SingleChatHeaderLeft
	});

	componentDidMount() {
		Fire.shared.on(message =>
			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, message)
			}))
		);
	}
	componentWillUnmount() {
		Fire.shared.off();
	}

	// componentDidMount() {
	// 	const user = this.user();
	// 	console.log('PROPS', this.props);
	// 	if (user != null) {
	// 		const messagesRef = db.ref(`messages/${user.id}`);
	// 		this.setState({ user, messagesRef });
	// 	}
	// 	if (this.state.messages.length) {
	// 		this.state.messagesRef.on(message =>
	// 			this.setState(previousState => ({
	// 				messages: GiftedChat.append(previousState.messages, message)
	// 			}))
	// 		);
	// 	}
	// }

	// componentWillUnmount() {
	// 	if (this.state.messages.length) {
	// 		this.state.messagesRef.off();
	// 	}
	// }

	get user() {
		return {
			// name: auth.currentUser.displayName,
			// _id: (auth.currentUser || {}).uid
			name: Fire.shared.user.displayName,
			_id: Fire.shared.uid
		};
	}

	sendMessage(messages) {
		console.log('messages***********', messages);
		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));
		const message = messages[messages.length - 1].text;
		const uid = this.state.user._id;
		const sender = Fire.shared.user.displayName;
		const timestamp = Date.now();
		this.props.postMessage({ uid, sender, message, timestamp });
		Fire.shared.send(messages);
	}

	render() {
		console.log('MESSAGES', this.state.messages);
		console.log('USER', Fire.shared.user);
		if (this.state.messages.length) {
			return (
				<View style={styles.container} contentContainerStyle={styles.contentContainer}>
					<Text>Hello</Text>
					<GiftedChat
						messages={this.state.messages}
						user={this.state.user}
						onSend={this.sendMessage}
						alignTop={true}
						placeholder='type a message...'
					/>
				</View>
			);
		} else return null;
	}
}

const mapState = state => ({
	messages: state.messages.messages
});

const mapDispatch = dispatch => ({
	postMessage: message => dispatch(sendMessage(message))
});

export default connect(mapState, mapDispatch)(SingleChat);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fafafa',
		marginTop: 10
	},
	contentContainer: {
		paddingTop: 15
	},
	headerContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fafafa',
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 4,
		paddingBottom: 4
	}
});
