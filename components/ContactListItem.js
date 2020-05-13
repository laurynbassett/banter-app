import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchCurrentChatId } from '../store/chats';

const ContactListItem = props => {
	console.log('PROPS', props);

	const goToSingleChat = contactId => {
		props.fetchCurrentChatId(contactId);
		props.navigation.navigate('SingleChat');
	};

	return (
		<TouchableHighlight onPress={() => goToSingleChat(props.id)}>
			<View style={styles.container}>
				{props.imageUrl && <Image source={{ uri: props.imageUrl }} style={styles.image} />}
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
