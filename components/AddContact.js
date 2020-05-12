import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { addNewContact } from '../store/user';

const AddContact = props => {
	const [ name, setName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ phone, setPhone ] = useState('');
	console.log('PROPS', props);
	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<TextInput placeholder='Name' style={styles.text} value={name} onChangeText={value => setName(value)} />
			</View>
			<View style={styles.form}>
				<TextInput
					placeholder='Email'
					style={styles.text}
					value={email}
					onChangeText={value => setEmail(value)}
				/>
			</View>
			<View style={styles.form}>
				<TextInput
					placeholder='Phone'
					style={styles.text}
					value={phone}
					onChangeText={value => setPhone(value)}
				/>
			</View>
			<View style={styles.button}>
				<Button title='AddContact' onPress={() => this.props.addNewContact(this.props.email)} />
				<View style={styles.buttonTextWrapper}>
					<Text style={[ styles.text, { color: 'red' } ]}>{this.props.addContactError}</Text>
				</View>
			</View>
		</View>
	);
};

const mapState = state => ({
	user: state.user,
	addContactError: state.user.error
});

const mapDispatch = dispatch => ({
	addNewContact: contact => dispatch(addNewContact(contact))
});

export default connect(mapState, mapDispatch)(AddContact);

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
		fontSize: 16,
		height: 30
	},
	button: {
		flex: 1
	},
	buttonTextWrapper: {
		marginTop: 10,
		alignItems: 'center'
	}
});
