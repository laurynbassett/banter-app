import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {Ionicons} from '@expo/vector-icons'
import Colors from '../constants/Colors'
import AvatarIcon from './AvatarIcon'
import {getMessages, setCurrentChat} from '../store'
import {memberNameHelper, memberImgHelper, createMemberString} from '../utils'

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
  const avatarContainer =
    props.memberNames.length > 1
      ? styles.groupContainer
      : styles.singleContainer
  console.log('MEMBER NAMES', props.memberNames)
  return (
    <View style={styles.centerContainer}>
      <View style={avatarContainer}>
        {props.memberImgs.map((img, idx) =>
          img !== 'undefined' ? (
            <AvatarIcon
              containerStyle={styles.imgWrapper}
              src={img}
              key={img}
              style={styles.image}
            />
          ) : (
            <AvatarIcon
              containerStyle={styles.imgWrapper}
              style={styles.avatar}
              key={idx}
              name={props.memberNames[idx]}
            />
          )
        )}
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const mapState = (state) => {
  const chat = state.chats.currentChat
  const getMemberNames =
    chat && chat.members ? memberNameHelper(Object.values(chat.members)) : []
  const getMemberImgs =
    chat && chat.members
      ? memberImgHelper(Object.keys(chat.members), state.user.contacts)
      : []
  return {
    memberNames: getMemberNames,
    memberImgs: getMemberImgs,
    displayName: state.user.name,
  }
}

export default connect(mapState)(SingleChatHeaderCenter)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  centerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  groupContainer: {
    flexDirection: 'row-reverse',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  singleContainer: {},
  left: {
    marginLeft: 15,
  },
  avatar: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    width: 38,
    height: 38,
    position: 'relative',
  },
  image: {
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: 45,
    height: 45,
    position: 'relative',
  },
  imgWrapper: {
    justifyContent: 'center',
    width: 33,
    height: 40,
    marginBottom: 5,
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
