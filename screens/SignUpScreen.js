import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { signUpWithEP } from '../store';

class SignUpScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			language: '',
			loading: false
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

	handleEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}

	handlePasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}

	render() {
		const { email, password, firstName, lastName, language, loading } = this.state;
		return (
			<View style={styles.container}>
				<TextInput
					style={styles.inputBox}
					type='First Name'
					value={firstName}
					placeholder='First Name'
					onChangeText={firstName => this.setState({ firstName })}
				/>

				<TextInput
					style={styles.inputBox}
					type='Last Name'
					value={lastName}
					placeholder='Last Name'
					onChangeText={lastName => this.setState({ lastName })}
				/>

				<TextInput
					style={styles.inputBox}
					type='Language'
					value={language}
					placeholder='Language'
					onChangeText={language => this.setState({ language })}
				/>

				<TextInput
					style={styles.inputBox}
					type='email'
					value={email}
					placeholder='Email'
					onChangeText={email => this.setState({ email })}
				/>
				<TextInput
					style={styles.inputBox}
					type='password'
					value={password}
					placeholder='Password'
					onChangeText={password => this.setState({ password })}
				/>
				<TouchableOpacity
					style={styles.button}
					onPress={() => this.props.signup(email, password, firstName, lastName, language, loading)}
				>
					<Text style={styles.buttonText}>Signup</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('LoginScreen')}>
					<Text style={styles.buttonText}>Login with existing account</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputBox: {
		width: '85%',
		margin: 10,
		padding: 15,
		fontSize: 16,
		borderColor: '#d3d3d3',
		borderWidth: 1,
		textAlign: 'left'
	},
	button: {
		width: WIDTH - 55,
		height: 45,
		backgroundColor: '#0D9BFE',
		borderRadius: 25,
		marginTop: 20,
		justifyContent: 'center'
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center'
	}
});

const mapState = state => ({
	user: state.user
});

const mapDispatch = dispatch => ({
	signup: (email, password, firstName, lastName, language) =>
		dispatch(signUpWithEP(email, password, firstName, lastName, language))
});

export default connect(mapState, mapDispatch)(SignUpScreen);
