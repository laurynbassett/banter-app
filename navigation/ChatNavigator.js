import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen } from '../screens';
import { ChatListHeaderRight } from '../components';

const Stack = createStackNavigator();

export default function ChatNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Chat'>
			<Stack.Screen name='Chat' component={ChatListScreen} options={{ title: 'Chat' }} />
		</Stack.Navigator>
	);
}
