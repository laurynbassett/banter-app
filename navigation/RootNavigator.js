import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SingleChatScreen } from '../screens';
import { SingleChatHeaderCenter, SingleChatHeaderLeft } from '../components';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function RootNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Chat'>
			<Stack.Screen
				name='Chat'
				component={BottomTabNavigator}
				options={{
					headerShown: false
				}}
			/>
			<Stack.Screen
				name='SingleChat'
				component={SingleChatScreen}
				options={({ navigation, route }) => ({
					title: 'Single Chat',
					headerTitle: () => <SingleChatHeaderCenter />,
					headerLeft: () => <SingleChatHeaderLeft navigation={navigation} route={route} back='Chats' />,
					headerStyle: { height: 130 }
				})}
			/>
		</Stack.Navigator>
	);
}
