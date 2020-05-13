import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Text, Platform } from 'react-native';

import { ChatListScreen, ContactsScreen, HomeScreen, SingleChatScreen } from '../screens';
import { ContactsHeader, ChatListHeader, TabBarIcon } from '../components';
import SettingsNavigator from './SettingsNavigator';
import ChatNavigator from './ChatNavigator';
import ContactNavigator from './ContactNavigator';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
	return (
		<BottomTab.Navigator initialRouteName={'Chats'}>
			<BottomTab.Screen
				name='Chats'
				component={ChatNavigator}
				options={{
					title: 'Chats',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							focused={focused}
							name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'}
						/>
					)
				}}
			/>
			<BottomTab.Screen
				name='Contacts'
				component={ContactNavigator}
				options={{
					title: 'Contacts',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
					)
					// headerTitle: ({ navigation }) => <AddContactButton nav={navigation} />
				}}
			/>
			<BottomTab.Screen
				name='Settings'
				component={SettingsNavigator}
				options={{
					title: 'Settings',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
					)
				}}
			/>
		</BottomTab.Navigator>
	);
}
