import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AddContactScreen, SingleChatScreen, ContactListScreen } from '../screens';
import { ContactsHeaderRight, SingleChatHeaderLeft, SingleChatHeaderCenter } from '../components';

const Stack = createStackNavigator();

export default function ContactNavigator({ navigation, route }) {
	return (
		<Stack.Navigator navigation={navigation} initialRouteName='Contacts'>
			<Stack.Screen
				name='Contact'
				component={ContactListScreen}
				options={{
					title: 'Contacts',
					headerRight: () => <ContactsHeaderRight navigation={navigation} />
				}}
			/>
			<Stack.Screen
				name='AddContact'
				component={AddContactScreen}
				options={{
					title: 'Add Contact'
				}}
			/>
			<Stack.Screen
				name='SingleChat'
				component={SingleChatScreen}
				options={{
					title: 'Single Chat',
					gestureEnabled: false,
					headerTitle: () => <SingleChatHeaderCenter />,
					headerLeft: () => <SingleChatHeaderLeft navigation={navigation} route={route} back='Contact' />,
					headerStyle: { height: 130 }
				}}
			/>
		</Stack.Navigator>
	);
}
