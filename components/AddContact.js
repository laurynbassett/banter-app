import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';

const AddContact = props => {
	console.log('PROPS', props);
	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<TextInput
					placeholder='Email'
					style={styles.text}
					value={this.props.email_contact}
					onChangeText={email => this.props.addContact(email)}
				/>
			</View>

			<View style={styles.button}>
				<Button title='AddContact' onPress={() => this.props.registerNewContact(this.props.email_contact)} />
				<View style={styles.buttonTextWrapper}>
					<Text style={[ styles.text, { color: 'red' } ]}>{this.props.add_contact_error}</Text>
				</View>
			</View>
		</View>
	);
};

export default AddContact;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15
	},
	form: {
		flex: 1,
		justifyContent: 'center'
	},
	text: {
		fontSize: 18,
		height: 40
	},
	button: {
		flex: 1
	},
	buttonTextWrapper: {
		marginTop: 10,
		alignItems: 'center'
	}
});
