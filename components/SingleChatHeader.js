import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {Ionicons} from '@expo/vector-icons'

import {Colors} from '../constants'
import {getMessages, setCurrentChat} from '../store'
import {memberImgHelper, SingleChatAvatar} from '../utils'

// SINGLE CHAT HEADER LEFT
const UnconnectedSingleChatHeaderLeft = (props) => {
  const goBack = () => {
    // remove current chat
    props.setCurrentChat('')
    props.getMessages([])
    // go back to all chats
    props.navigation.navigate(props.back)
  }

  return (
    <TouchableOpacity
      style={styles.left}
      onPress={goBack}
      hitSlop={styles.hitSlop}
    >
      <Ionicons
        name="ios-arrow-back"
        size={25}
        color={Colors.tabIconSelected}
      />
    </TouchableOpacity>
  )
}

const mapDispatch = (dispatch) => ({
  setCurrentChat: (chatId) => dispatch(setCurrentChat(chatId)),
  getMessages: (msgs) => dispatch(getMessages(msgs)),
})

export const SingleChatHeaderLeft = connect(
  null,
  mapDispatch
)(UnconnectedSingleChatHeaderLeft)

// SINGLE CHAT HEADER CENTER
const SingleChatHeaderCenter = (props) => {
  const text =
    props.memberNames.length > 1
      ? `${props.memberNames.length} people`
      : props.memberNames[0]

  return (
    <View style={styles.centerContainer}>
      <SingleChatAvatar
        memberImgs={props.memberImgs}
        memberNames={props.memberNames}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const mapState = (state) => {
  const chat = state.chats.currentChat
  let members = chat && chat.members ? chat.members : []
  delete members[state.user.id]
  const getMemberNames = chat && chat.members ? Object.values(members) : []
  const getMemberImgs =
    chat && chat.members
      ? memberImgHelper(Object.keys(members), state.user.contacts)
      : []
  return {
    memberNames: getMemberNames,
    memberImgs: getMemberImgs,
    displayName: state.user.name,
  }
}

export default connect(mapState)(SingleChatHeaderCenter)

const styles = StyleSheet.create({
  centerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  left: {
    marginLeft: 15,
  },
  text: {
    fontSize: 13,
    textAlign: 'center',
  },
  hitSlop: {
    top: 15,
    left: 15,
    bottom: 15,
    right: 20,
  },
})
