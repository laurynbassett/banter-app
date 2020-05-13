import React from 'react';
import { Image, Platform, StyleSheet, Text, View, FlatList } from 'react-native';

import { AddContact } from '../components';

const AddContactScreen = props => {
	return (
		<View style={styles.container}>
			<AddContact />
		</View>
	);
};

export default AddContactScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
