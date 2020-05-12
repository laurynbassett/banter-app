import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ContactScreen from "../screens/Contacts/ContactScreen";

const Stack = createStackNavigator();

export default function ContactNavigator() {
  return (
    <Stack.Navigator initialRouteName="Contact">
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: "Contact" }}
      />
    </Stack.Navigator>
  );
}
