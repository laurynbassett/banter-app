import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { ChatListHeaderRight, TabBarIcon } from '../components';
import SettingsNavigator from './SettingsNavigator';
import ChatNavigator from './ChatNavigator';
import ContactNavigator from './ContactNavigator';
import { getMessages } from '../store';
import { ChatListScreen } from '../screens';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = props => {
	return (
		<BottomTab.Navigator initialRouteName={'Chats'} defaultNavigationOptions={{ tabBarVisible: false }}>
			<BottomTab.Screen
				name='Chats'
				component={ChatNavigator}
				options={({ route }) => ({
					title: 'Chats',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							focused={focused}
							name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'}
						/>
					),
					tabBarVisible: getTabBarVisible(route),
					headerRight: () => <ChatListHeaderRight navigation={navigation} />
				})}
			/>
			<BottomTab.Screen
				name='Contacts'
				component={ContactNavigator}
				options={({ route }) => ({
					title: 'Contacts',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
					),
					tabBarVisible: getTabBarVisible(route)
				})}
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
};

const mapDispatch = dispatch => ({
	getMessages: () => getMessages()
});

export default connect(null, mapDispatch)(BottomTabNavigator);

const getTabBarVisible = route => {
	const routeName = route.state
		? route.state.routes[route.state.index].name
		: route.params ? route.params.screen : 'Chats';

	if (routeName === 'SingleChat') {
		return false;
	}
	return true;
};
