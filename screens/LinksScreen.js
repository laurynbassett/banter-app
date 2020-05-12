import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

import firebase, { auth } from '../Firebase';
import { fetchChatrooms } from '../store/user';
import { fetchAllChats } from '../store/chats';

const LinksScreen = props => {
	const fetchChatData = async () => {
		const uid = auth.currentUser.uid;
		await props.fetchChatrooms(uid);
		console.log('FETCHED CHATROOMS - uid: ', uid);
		await props.fetchAllChats();
		console.log('FETCHED CHATS');
	};

	useEffect(() => {
		fetchChatData();
	}, []);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<Button
				title='SingleChat'
				onPress={() =>
					props.navigation.navigate('SingleChat', {
						contactId: 'Xr067E9MvdVlMPB3k2fXO7EfFgZ2',
						contactName: 'Isra Khan',
						contactEmail: 'israkhan2@gmail.com'
					})}
			/>
			<Button style={styles.button} title='Log Out' onPress={() => firebase.auth().signOut()} />
		</ScrollView>
	);
};

const mapDispatch = dispatch => ({
	fetchChatrooms: uid => dispatch(fetchChatrooms(uid)),
	fetchAllChats: () => dispatch(fetchAllChats())
});

export default connect(null, mapDispatch)(LinksScreen);

function OptionButton({ label, onPress, isLastOption }) {
	return (
		<RectButton style={[ styles.option, isLastOption && styles.lastOption ]} onPress={onPress}>
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.optionIconContainer} />
				<View style={styles.optionTextContainer}>
					<Text style={styles.optionText}>{label}</Text>
				</View>
			</View>
		</RectButton>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fafafa'
	},
	contentContainer: {
		paddingTop: 15
	},
	optionIconContainer: {
		marginRight: 12
	},
	option: {
		backgroundColor: '#fdfdfd',
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: 0,
		borderColor: '#ededed'
	},
	lastOption: {
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	optionText: {
		fontSize: 15,
		alignSelf: 'flex-start',
		marginTop: 1
	}
});
