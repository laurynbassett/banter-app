import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Entypo} from '@expo/vector-icons'
import Layout from '../constants/Layout'

//TODO: Remove ChatListHeader
export const ChatListHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.text}>All Chats</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => props.nav.navigate('SingleChat')}>
          <Entypo name="new-message" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const ChatListHeaderRight = (props) => {
  return (
    <View style={styles.left}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('NewIndividualChat')}
      >
        <Entypo name="new-message" size={20} style={styles.icon} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  center: {
    alignContent: 'center',
    alignSelf: 'center',
    marginLeft: Layout.window.width * 0.25,
    marginRight: Layout.window.width * 0.25,
  },
  right: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  icon: {
    marginRight: 20,
  },
})
