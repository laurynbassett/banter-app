import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen, SingleChatScreen } from '../screens';
import { ChatListHeaderRight, SingleChatHeader } from '../components';

const Stack = createStackNavigator();

export default function ChatNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Chat'>
			<Stack.Screen name='Chat' component={ChatListScreen} options={{ title: 'Chat' }} />
			<Stack.Screen name='SingleChat' component={SingleChatScreen} options={{ tabBarVisible: false }} />
		</Stack.Navigator>
	);
}
