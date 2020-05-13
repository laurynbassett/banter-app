import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { TabBarIcon } from './TabBarIcon';
import Layout from '../constants/Layout';

const ContactsHeader = props => {
	console.log('BTN PROPS', props);
	return (
		<View style={styles.container}>
			<View style={styles.center}>
				<Text style={styles.text}>Contacts</Text>
			</View>
			<View style={styles.right}>
				<TouchableOpacity onPress={() => props.nav.navigate('AddContact')}>
					<Ionicons name='ios-add' size={30} style={styles.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ContactsHeader;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	center: {
		alignContent: 'center',
		marginLeft: Layout.window.width * 0.25,
		marginRight: Layout.window.width * 0.25
	},
	right: {
		alignContent: 'flex-end'
	},
	text: {
		fontSize: 20
	}
});
