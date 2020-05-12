/* eslint-disable react/display-name */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Platform } from "react-native";

import LinksScreen from "../screens/LinksScreen";
import { HomeScreen, SingleChatScreen } from "../screens";
import ChatListScreen from "../screens/ChatListScreen";
import { TabBarIcon } from "../components";
import SettingsNavigator from "./SettingsNavigator";
import ChatNavigator from "./ChatNavigator";
import ContactNavigator from "./ContactNavigator";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName={"Chats"}>
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
