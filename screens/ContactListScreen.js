import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ContactListItem } from '../components';
import { fetchContacts } from '../store';

class ContactListScreen extends Component {
	componentDidMount() {
		this.props.fetchContacts();
		console.log('FETCHED 0');
	}

	render() {
		return (
			<FlatList
				data={this.props.contacts}
				renderItem={({ item }) => <ContactListItem navigation={this.props.navigation} {...item} />}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}
}

const mapState = state => ({
	contacts: state.user.contacts
});

const mapDispatch = dispatch => ({
	fetchContacts: () => dispatch(fetchContacts())
});

export default connect(mapState, mapDispatch)(ContactListScreen);
