import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Entypo} from '@expo/vector-icons'

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
    <View>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('NewIndividualChat')}
      >
        <Entypo name="new-message" size={20} style={styles.icon} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 20,
  },
})
