import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { TabBarIcon } from './TabBarIcon';
import { fetchMemberNames } from '../store/chats';

const SingleChatHeader = props => {
	return (
		<View style={styles.container}>
			<View style={styles.centerContainer}>
				<Image style={styles.image} source={{ uri: dummyUri }} />
				<Text style={styles.text}>Contacts</Text>
			</View>
		</View>
	);
};

const mapState = state => ({
	members: state.chats.currentChat.members
});

const mapDispatch = dispatch => ({
	fetchMemberNames: () => dispatch(fetchMemberNames())
});

export default connect(mapState, mapDispatch)(SingleChatHeader);

export const SingleChatHeaderLeft = props => {
	return (
		<View style={styles.left}>
			<TouchableOpacity onPress={() => props.nav.goBack()}>
				<TabBarIcon focused={focused} name='ios-arrow-back' />
			</TouchableOpacity>
		</View>
	);
};

export const SingleChatHeaderCenter = props => {
	const dummyUri =
		'https://ik.imagekit.io/ionicfirebaseapp/getflutter/tr:dpr-auto,tr:w-auto/2020/02/circular--1--1.png';

	return (
		<View style={[ styles.center, styles.centerContainer ]}>
			{/* <Image style={styles.image} source={{ uri: props.uri }} /> */}
			<Image style={styles.image} source={{ uri: dummyUri }} />
			<Text />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center'
	},
	centerContainer: {
		flexDirection: 'column'
	},
	image: {
		width: 20,
		height: 20,
		borderRadius: 100,
		borderWidth: 1
	}
});
