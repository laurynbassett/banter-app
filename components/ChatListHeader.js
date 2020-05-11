import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export const ChatListHeaderRight = () => {
	return (
		<View style={styles.left}>
			// add onPress
			<TouchableOpacity>
				<Entypo name='new-message' size={30} style={{ marginBottom: -3 }} />
			</TouchableOpacity>
		</View>
	);
};

export const ChatListHeaderCenter = props => {
	const dummyUri =
		'https://ik.imagekit.io/ionicfirebaseapp/getflutter/tr:dpr-auto,tr:w-auto/2020/02/circular--1--1.png';

	return (
		<View style={styles.center}>
			{/* <Image style={styles.image} source={{ uri: props.uri }} /> */}
			<Image style={styles.image} source={{ uri: dummyUri }} />
			<Text />
		</View>
	);
};

const styles = StyleSheet.create({
	left: {
		textAlign: 'left'
	},
	center: {
		flexDirection: 'column',
		textAlign: 'center'
	},
	image: {
		width: 20,
		height: 20,
		borderRadius: 100,
		borderWidth: 1
	}
});
