import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { SingleChat } from '../components';

export default class SingleChatScreen extends Component {
	static navigationOptions = {
		header: 'Home'
	};

	render() {
		return (
			<View style={styles.container} contentContainerStyle={styles.contentContainer}>
				<SingleChat navigation={this.props.navigation} route={this.props.route} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fafafa'
	},
	contentContainer: {
		paddingTop: 15
	}
});
