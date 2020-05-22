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
    // console.log('CLICKED LEFT', props);
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
  const members = props.memberNames.filter(
    (member) => member !== props.displayName
  )
  // const text =
  //   props.memberNames > 1
  //     ? `${props.memberNames.length} people`
  //     : props.memberNames[0]

  return members.length === 1 ? (
    <View style={styles.centerContainer}>
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
      <Text style={styles.text}>{members[0]}</Text>
    </View>
  ) : (
    <View style={styles.centerContainer}>
      <Text style={styles.text}>{createMemberString(members)}</Text>
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
  left: {
    marginLeft: 15,
  },
  image: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    width: 30,
    height: 30,
  },
  imgWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  hitSlop: {top: 10, left: 10, bottom: 10, right: 10},
})
