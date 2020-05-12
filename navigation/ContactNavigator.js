import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ContactScreen from '../screens/Contacts/ContactScreen';
import { ContactsScreen } from '../screens';

const Stack = createStackNavigator();

export default function ContactNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Contact'>
			<Stack.Screen name='Contact' component={ContactsScreen} options={{ title: 'Contact' }} />
		</Stack.Navigator>
	);
}
