import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { TabBarIcon } from "../components";
import SettingsNavigator from "./SettingsNavigator";
import ChatNavigator from "./ChatNavigator";
import ContactNavigator from "./ContactNavigator";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Chats";

export default function BottomTabNavigator() {
  // navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Chats"
        component={ChatNavigator}
        options={{
          title: "Chats",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-chatbubbles" />
          ),
          headerTitle: "Chats",
        }}
      />
      <BottomTab.Screen
        name="Contacts"
        component={ContactNavigator}
        options={{
          title: "Contacts",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-contact" />
          ),
          headerTitle: "Contacts",
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-settings" />
          ),
          headerTitle: "Settings",
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "Chats":
      return "All Chats";
    case "Contacts":
      return "Contacts";
    case "Settings":
      return "Settings";
  }
}
