import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ContactListItem } from '../components';
import { fetchContacts } from '../store/user';

const dummyData = [
	{
		id: 'Xr067E9MvdVlMPB3k2fXO7EfFgZ2',
		name: 'Isra Khan',
		email: 'israkhan2@gmail.com',
		phone: '111-111-1111',
		imageUrl: 'https://i.picsum.photos/id/14/536/354.jpg'
	},
	{
		id: '-M73eGgR51mWegoz_uUw',
		name: 'Jacob Wallin',
		email: 'jacobwallin@gmail.com',
		phone: '222-222-2222',
		imageUrl: 'https://picsum.photos/seed/picsum/200/300'
	}
];

const ContactsScreen = props => {
	const loadContacts = async () => {
		await props.fetchContacts;
	};

	useEffect(() => {
		loadContacts();
	}, []);

	const contacts = props.contacts;

	return (
		<FlatList
			data={dummyData}
			renderItem={({ item }) => <ContactListItem navigation={props.navigation} {...item} />}
			keyExtractor={(item, index) => index.toString()}
		/>
	);
};

const mapState = state => ({
	contacts: state.user.contactObjs
});

const mapDispatch = dispatch => ({
	fetchContacts: () => dispatch(fetchContacts())
});

export default connect(mapState, mapDispatch)(ContactsScreen);
