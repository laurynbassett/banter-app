import * as React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'

import {ChatListScreen} from '../screens'

const ChatTab = createMaterialTopTabNavigator()

const ChatTabNavigator = ({navigation}) => {
  return (
    <ChatTab.Navigator
      initialRouteName={'All'}
      defaultNavigationOptions={{tabBarVisible: false}}
    >
      <ChatTab.Screen
        name="All"
        component={ChatListScreen}
        initialParams={{tab: 'all'}}
        options={{
          title: 'All',
        }}
      />
      <ChatTab.Screen
        name="Groups"
        component={ChatListScreen}
        initialParams={{tab: 'groups'}}
        options={{
          title: 'Groups',
        }}
      />
    </ChatTab.Navigator>
  )
}

export default ChatTabNavigator
