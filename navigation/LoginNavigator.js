import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignUpScreen, LoginScreen } from "./../screens";

const Stack = createStackNavigator();

export default function LoginNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ title: "Sign Up" }}
      />
    </Stack.Navigator>
  );
}

// export default class LoginNavigator extends React.Component {

//   render() {
//     return (
//       <Stack.Navigator initialRouteName="LoginScreen">
//         <Stack.Screen
//           name="LoginScreen"
//           component={LoginScreen}
//           options={{ title: "Login" }}
//         />
//         <Stack.Screen
//           name="SignUpScreen"
//           component={SignUpScreen}
//           options={{ title: "Sign Up" }}
//         />
//       </Stack.Navigator>
//     );
//   }
// }
