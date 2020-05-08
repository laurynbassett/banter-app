import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import LinksScreen from '../screens/LinksScreen';
import { HomeScreen, SingleChatScreen } from '../screens';
import ChatListScreen from "../screens/ChatListScreen";
import { TabBarIcon } from '../components';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Chats';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route)});

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Chats"
        component={ChatListScreen}
        options={{
          title: 'Chats',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-chatbubbles" />,
        }}
      />
      <BottomTab.Screen
        name="Contacts"
        component={LinksScreen}
        options={{
          title: 'Contacts',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contact" />,
        }}
      />
       <BottomTab.Screen
        name="Settings"
        component={LinksScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-settings" />,
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
