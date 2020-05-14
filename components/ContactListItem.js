import React from 'react';
import { connect } from 'react-redux';
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';

import { fetchCurrentChatId } from '../store/chats';

const ContactListItem = props => {
	console.log('ContactListItem PROPS', props);

	const goToSingleChat = async () => {
		console.log('CLICKED ON CONTACT', props.id);
		// set current chatroom in redux
		await props.fetchCurrentChatId(props.id, props.uid);
		console.log('AWAITED NOW NAVIGATING');

		// navigate to single chat page
		props.navigation.navigate('SingleChat', {
			contactId: props.id,
			name: props.name
		});
	};

	const defaultUrl = 'https://i.picsum.photos/id/14/536/354.jpg';
	return (
		<TouchableHighlight onPress={goToSingleChat}>
			<View style={styles.container}>
				<Image source={{ uri: props.imageUrl || defaultUrl }} style={styles.image} />
				<View style={styles.contactWrapper}>
					<View style={styles.contactNameWrapper}>
						<Text style={styles.contactName}>{props.name}</Text>
					</View>
					<View style={styles.contactInfoWrapper}>
						<Text style={styles.contactWrapper}>{props.email}</Text>
					</View>
					{props.phone ? (
						<View style={styles.contactInfoWrapper}>
							<Text style={styles.contactWrapper}>{props.phone}</Text>
						</View>
					) : null}
				</View>
			</View>
		</TouchableHighlight>
	);
};

const mapState = state => ({
	uid: state.firebase.auth.uid
});

const mapDispatch = dispatch => ({
	fetchCurrentChatId: (contactId, uid) => dispatch(fetchCurrentChatId(contactId, uid))
});

export default connect(mapState, mapDispatch)(ContactListItem);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		flexDirection: 'row',
		padding: 15,
		borderBottomWidth: 1,
		borderColor: '#b7b7b7'
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50
	},
	contactNameWrapper: {
		marginLeft: 10
	},
	contactWrapper: {
		marginLeft: 10
	},
	contactName: {
		fontSize: 23,
		fontWeight: 'bold'
	},
	contactInfoWrapper: {
		marginTop: 5
	},
	contactInfo: {
		fontSize: 13
	}
});
