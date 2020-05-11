import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Text, Platform } from 'react-native';

import LinksScreen from '../screens/LinksScreen';
import { 	ChatListScreen, ContactsScreen, HomeScreen, SingleChatScreen } from '../screens';
import { TabBarIcon } from '../components';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Chats';

export default function BottomTabNavigator({ navigation, route }) {
	navigation.setOptions({ headerTitle: getHeaderTitle(route)});

	return (
		<BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
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
					)
				}}
			/>
			<BottomTab.Screen
				name='Contacts'
				component={ContactsScreen}
				options={{
					title: 'Contacts',
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
					)
				}}
			/>
			<BottomTab.Screen
				name='Settings'
				component={LinksScreen}
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

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Chats':
      return 'All Chats'
    case 'Contacts':
      return 'Contacts';
    case 'Settings':
      return 'Settings';
  }
}
