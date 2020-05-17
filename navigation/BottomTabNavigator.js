import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

import { ChatListHeaderRight, TabBarIcon } from '../components';
import SettingsNavigator from './SettingsNavigator';
import ChatNavigator from './ChatNavigator';
import ContactNavigator from './ContactNavigator';
import { getMessages } from '../store';
import { ChatListScreen } from '../screens';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = props => {
	console.log('BOTTOM PROPS', props);

	return (
		<BottomTab.Navigator
			initialRouteName={'Chats'}
			tabBarOnPress={() => {
				console.log('BOTTOM TAB', props);
				props.getMessages([]);
			}}
		>
			<BottomTab.Screen
				name='Chats'
				component={ChatListScreen}
				options={{
					title: 'Chats',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							focused={focused}
							name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'}
						/>
					),
					headerRight: () => <ChatListHeaderRight navigation={navigation} />,
					tabPress: () => {
						console.log('BOTTOM TAB', props);
						props.getMessages('');
					}
				}}
			/>
			<BottomTab.Screen
				name='Contacts'
				component={ContactNavigator}
				options={{
					title: 'Contacts',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
					),
					tabPress: () => {
						console.log('BOTTOM TAB', props);
						props.getMessages('');
					}
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
					),
					tabPress: () => {
						console.log('BOTTOM TAB', props);
						props.getMessages('');
					}
				}}
			/>
		</BottomTab.Navigator>
	);
};

const mapDispatch = dispatch => ({
	getMessages: () => getMessages()
});

export default connect(null, mapDispatch)(BottomTabNavigator);
