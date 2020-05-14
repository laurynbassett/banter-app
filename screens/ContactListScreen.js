import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ContactListItem } from '../components';
import { fetchContacts } from '../store/user';
import { fetchAllChats } from '../store/chats';

class ContactListScreen extends Component {
	async componentDidMount() {
		console.log('FETCHING CONTACTS - ContactListScreen');
		await this.props.fetchContacts();
		console.log('FETCHING CHATS - ContactListScreen');
		await this.props.fetchAllChats();
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
	contacts: state.user.contactObjs
});

const mapDispatch = dispatch => ({
	fetchAllChats: () => dispatch(fetchAllChats()),
	fetchContacts: () => dispatch(fetchContacts())
});

export default connect(mapState, mapDispatch)(ContactListScreen);
