import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen, SingleChatScreen } from '../screens';
import { ChatListHeaderRight, SingleChatHeaderLeft } from '../components';

const Stack = createStackNavigator();

export default function ChatNavigator({ navigation, route }) {
	return (
		<Stack.Navigator initialRouteName='Chats'>
			<Stack.Screen
				name='Chats'
				component={ChatListScreen}
				options={({ navigation }) => ({
					title: 'Chats',
					headerRight: () => <ChatListHeaderRight navigation={navigation} />
				})}
			/>
			<Stack.Screen
				name='SingleChat'
				component={SingleChatScreen}
				options={{
					title: 'Single Chat',
					gestureEnabled: false,
					// headerTitle: () => <SingleChatHeaderCenter />,
					headerLeft: () => <SingleChatHeaderLeft navigation={navigation} route={route} back='Chats' />,
					headerStyle: { height: 130 }
				}}
			/>
		</Stack.Navigator>
	);
}
