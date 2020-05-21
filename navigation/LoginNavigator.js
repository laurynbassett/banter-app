import * as React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {LoginScreen, SignUpScreen} from '../screens'
const Stack = createStackNavigator()

export default function LoginNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{title: 'Login'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{title: 'Sign Up'}}
      />
    </Stack.Navigator>
  )
}
