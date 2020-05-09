// import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import firebase from 'firebase/app';

export default function LinksScreen(props) {
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<Button title='SingleChat' onPress={() => props.navigation.navigate('SingleChat')} />

			<Button style={styles.button} title='Log Out' onPress={() => firebase.auth().signOut()} />
		</ScrollView>
	);
}

function OptionButton({ label, onPress, isLastOption }) {
	return (
		<RectButton style={[ styles.option, isLastOption && styles.lastOption ]} onPress={onPress}>
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.optionIconContainer}>
					{/* <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" /> */}
				</View>
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
