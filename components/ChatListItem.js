import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {memberNameHelper, memberImgHelper, ChatListAvatar} from '../utils'
import {Colors} from '../constants'

export default function ChatListItem(props) {
  let members = props.item.members
  delete members[props.userId]

  members = memberNameHelper(Object.values(members))
  const avatarImgs = memberImgHelper(
    Object.keys(props.item.members),
    props.contacts
  ).slice(0, 2)
  const goToSingleChat = (chatId) => {
    // set current chatroom in redux
    props.setCurrentChat(chatId)
    // navigate to single chat page
    props.navigation.navigate('SingleChat', [
      {
        contactId: props.id,
        contactName: props.name,
      },
    ])
  }
  return (
    <TouchableOpacity onPress={() => goToSingleChat(props.item.id)}>
      <View style={styles.itemView}>
        <ChatListAvatar avatarImgs={avatarImgs} members={members} />
        <View style={styles.detailsWrapper}>
          <View style={styles.chatNameWrapper}>
            <Text style={styles.chatName}>
              {members.length > 1
                ? members.length > 2
                  ? `${members[0]} & ${members.length - 1} others`
                  : `${members[0]} & ${members.length - 1} other`
                : members}
            </Text>
          </View>
          <View style={styles.messageWrapper}>
            <Text style={styles.message}>{props.item.lastMessage}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemView: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.medGray,
    backgroundColor: '#fff',
  },
  chatName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 17,
    color: '#aaa',
  },
  detailsWrapper: {
    marginLeft: 10,
  },
  chatNameWrapper: {
    marginLeft: 10,
  },
  messageWrapper: {
    marginTop: 5,
    marginLeft: 10,
  },
})
