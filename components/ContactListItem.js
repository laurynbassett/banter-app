import React from 'react';
import { connect } from 'react-redux';
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';

import { fetchCurrentChatId } from '../store/chats';

const ContactListItem = props => {
	console.log('PROPS', props);

	const goToSingleChat = () => {
		props.fetchCurrentChatId(props.id);
		props.navigation.navigate('SingleChat', {
			id: props.id,
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
						<Text style={styles.contactWrapper}>{props.phone}</Text>
					</View>
					<View style={styles.contactInfoWrapper}>
						<Text style={styles.contactWrapper}>{props.email}</Text>
					</View>
				</View>
			</View>
		</TouchableHighlight>
	);
};

const mapDispatch = dispatch => ({
	fetchCurrentChatId: id => dispatch(fetchCurrentChatId(id))
});

export default connect(null, mapDispatch)(ContactListItem);

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
