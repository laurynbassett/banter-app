import React from 'react';
import { Image, Platform, StyleSheet, Text, View, FlatList } from 'react-native';

import { ContactListItem } from '../components';

const dummyData = [
	{
		id: 'Xr067E9MvdVlMPB3k2fXO7EfFgZ2',
		name: 'Isra Khan',
		email: 'israkhan2@gmail.com',
		phone: '111-111-1111',
		profileImage: 'https://i.picsum.photos/id/14/536/354.jpg'
	},
	{
		id: '-M73eGgR51mWegoz_uUw',
		name: 'Jacob Wallin',
		email: 'jacobwallin@gmail.com',
		phone: '222-222-2222',
		profileImage: 'https://picsum.photos/seed/picsum/200/300'
	}
];

const ContactsScreen = props => {
	return (
		<FlatList
			data={dummyData}
			renderItem={({ item }) => <ContactListItem navigation={props.navigation} {...item} />}
			keyExtractor={(item, index) => index.toString()}
		/>
	);
};

export default ContactsScreen;
