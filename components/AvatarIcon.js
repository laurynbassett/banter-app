import UserAvatar from 'react-native-user-avatar'
import React from 'react'
import {View} from 'react-native'

export default function AvatarIcon(props) {
  return (
    <View style={props.containerStyle}>
      <UserAvatar
        name={props.name}
        src={props.src}
        size={32}
        style={props.style}
        bgColor="#A9A9A9"
      />
    </View>
  )
}
