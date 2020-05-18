import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatListScreen, SingleChatScreen } from "../screens";
import {
  ChatListHeaderRight,
  SingleChatHeaderLeft,
  SingleChatHeaderCenter,
} from "../components";

const Stack = createStackNavigator();

export default function ChatNavigator({ navigation, route }) {
  return (
    <Stack.Navigator
      initialRouteName="Chat"
      navigationOptions={{ tabBarVisible: false }}
    >
      <Stack.Screen
        name="Chat"
        component={ChatListScreen}
        options={({ navigation }) => ({
          title: "All Chats",
          headerRight: () => <ChatListHeaderRight navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="SingleChat"
        component={SingleChatScreen}
        options={{
          title: "Single Chat",
          gestureEnabled: false,
          headerTitle: () => <SingleChatHeaderCenter />,
          headerLeft: () => (
            <SingleChatHeaderLeft
              navigation={navigation}
              route={route}
              back="Chat"
            />
          ),
          headerStyle: { height: 130 },
        }}
        navigationOptions={{ tabBarVisible: false }}
      />
    </Stack.Navigator>
  );
}
