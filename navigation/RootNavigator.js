import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen, SingleChatScreen } from '../screens';
import { ChatListHeaderRight, SingleChatHeaderCenter, SingleChatHeaderLeft } from '../components';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function RootNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Chats'>
			<Stack.Screen
				name='BottomTabNavigator'
				component={BottomTabNavigator}
				options={{
					headerShown: false
				}}
			/>
			<Stack.Screen
				name='SingleChat'
				component={SingleChatScreen}
				options={{
					title: 'Single Chat',
					// gestureEnabled: false,
					headerTitle: () => <SingleChatHeaderCenter />,
					headerLeft: () => <SingleChatHeaderLeft navigation={navigation} back='Chats' />,
					headerStyle: { height: 130 }
				}}
			/>
		</Stack.Navigator>
	);
}
