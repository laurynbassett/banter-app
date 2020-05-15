import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import AvatarIcon from './AvatarIcon';
import { fetchMemberNames, getMessages, setCurrentChat } from '../store';

const UnconnectedSingleChatHeaderLeft = props => {
	const goBack = () => {
		// remove current chat
		props.setCurrentChat('');
		props.getMessages([]);
		// go back to all chats
		props.navigation.navigate(props.back);
	};
	return (
		<TouchableOpacity style={styles.left} onPress={goBack} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
			<Ionicons name='ios-arrow-back' size={25} color={Colors.tabIconSelected} />
		</TouchableOpacity>
	);
};

const mapDispatch = dispatch => ({
	setCurrentChat: chatId => dispatch(setCurrentChat(chatId)),
	getMessages: msgs => dispatch(getMessages(msgs))
});

export const SingleChatHeaderLeft = connect(null, mapDispatch)(UnconnectedSingleChatHeaderLeft);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center'
	},
	centerContainer: {
		flexDirection: 'column'
	},
	left: {
		marginLeft: 15
	},
	imageWrapper: {
		width: 15,
		height: 15
	},
	image: {
		borderRadius: 100,
		borderWidth: 1
	},
	text: {
		fontSize: 13,
		marginTop: 40,
		marginBottom: 5
	}
});
