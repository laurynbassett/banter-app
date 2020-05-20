import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Ionicons} from '@expo/vector-icons'

export const ContactsHeaderRight = (props) => {
  return (
    <TouchableOpacity onPress={() => props.navigation.navigate('AddContact')}>
      <Ionicons name="ios-add" size={30} style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 20,
  },
})
