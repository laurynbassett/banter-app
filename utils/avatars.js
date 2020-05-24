import React from 'react'
import {StyleSheet, View} from 'react-native'

import {AvatarIcon} from '../components'

export const ChatListAvatar = (props) => {
  const avatarContainer =
    props.members.length > 1
      ? styles.groupChatImgContainer
      : styles.singleChatImgContainer
  const chatImg =
    props.members.length > 1 ? styles.groupChatImg : styles.singleChatImg
  const chatImgWrapper =
    props.members.length > 1
      ? styles.groupChatImgWrapper
      : styles.singleChatImgWrapper

  return (
    <View style={avatarContainer}>
      {props.avatarImgs.map((img, idx) =>
        img !== 'undefined' ? (
          <AvatarIcon
            containerStyle={
              idx === 1 ? styles.groupChatImgWrapperTwo : chatImgWrapper
            }
            src={img}
            key={img}
            style={chatImg}
          />
        ) : (
          <AvatarIcon
            containerStyle={
              idx === 1 ? styles.groupChatImgWrapperTwo : chatImgWrapper
            }
            style={chatImg}
            key={idx}
            name={props.members[idx]}
          />
        )
      )}
    </View>
  )
}

export const ContactListAvatar = (props) => {
  return (
    <View>
      {props.imageUrl ? (
        <AvatarIcon src={props.imageUrl} style={styles.contactImg} />
      ) : (
        <AvatarIcon style={styles.contactImg} name={props.name} />
      )}
    </View>
  )
}

export const SingleChatAvatar = (props) => {
  const avatarContainer =
    props.memberNames.length > 1
      ? styles.groupImgContainer
      : styles.singleImgContainer

  return (
    <View style={avatarContainer}>
      {props.memberImgs.map((img, idx) =>
        img !== 'undefined' ? (
          <AvatarIcon
            containerStyle={styles.singleImgWrapper}
            src={img}
            key={img}
            style={styles.singleImg}
          />
        ) : (
          <AvatarIcon
            containerStyle={styles.singleImgWrapper}
            style={styles.singleImg}
            key={idx}
            name={props.memberNames[idx]}
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  // Single Chat
  groupImgContainer: {
    flexDirection: 'row-reverse',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  singleImgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  singleImgWrapper: {
    justifyContent: 'center',
    width: 28,
    height: 32,
    marginBottom: 5,
  },
  singleImg: {
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    width: 32,
    height: 32,
  },
  // Chat List
  groupChatImgContainer: {
    flexDirection: 'column',
    width: 49,
  },
  singleChatImgContainer: {
    justifyContent: 'center',
  },
  singleChatImgWrapper: {
    justifyContent: 'center',
  },
  groupChatImgWrapper: {
    justifyContent: 'center',
    width: 30,
    height: 15,
    marginBottom: 5,
  },
  groupChatImgWrapperTwo: {
    justifyContent: 'center',
    width: 30,
    height: 15,
    paddingLeft: 15,
  },
  singleChatImg: {
    borderRadius: 100,
    width: 50,
    height: 50,
  },
  groupChatImg: {
    width: 30,
    height: 30,
  },
  groupChatImgTwo: {
    paddingLeft: 0,
    paddingTop: 0,
    width: 30,
    height: 30,
  },
  // Contact List
  contactImg: {
    borderRadius: 100,
    width: 50,
    height: 50,
  },
})
