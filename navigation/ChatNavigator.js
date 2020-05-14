import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen, SingleChatScreen } from '../screens';

const Stack = createStackNavigator();

export default function ChatNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Chat'>
			<Stack.Screen name='Chat' component={ChatListScreen} options={{ title: 'Chat' }} />
			<Stack.Screen name='SingleChat' component={SingleChatScreen} options={{ title: 'Single Chat' }} />
		</Stack.Navigator>
	);
}
