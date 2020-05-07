import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TabBarIcon } from '.';

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
		borderwidth: 1
	}
});
