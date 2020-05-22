import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Entypo} from '@expo/vector-icons'

import Layout from '../constants/Layout'

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
