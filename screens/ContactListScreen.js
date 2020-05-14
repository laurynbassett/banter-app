import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ContactListItem } from '../components';
import { fetchContacts } from '../store/user';

class ContactListScreen extends Component {
	async componentDidMount() {
		console.log('FETCHING CONTACTS - ContactListScreen');
		await this.props.fetchContacts();
	}
	render() {
		console.log('CONTACT LIST SCREEN PROPS', this.props);
		const contacts = this.props.contacts;
		return (
			<FlatList
				data={contacts}
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
