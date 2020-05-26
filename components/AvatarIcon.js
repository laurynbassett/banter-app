import UserAvatar from 'react-native-user-avatar'
import React from 'react'
import {View} from 'react-native'
import {Colors} from '../constants'
export default function AvatarIcon(props) {
  return (
    <View style={props.containerStyle}>
      <UserAvatar
        name={props.name}
        src={props.src}
        size={32}
        style={props.style}
        imageStyle={props.style}
        bgColor={props.src ? '#fff' : Colors.borderGray}
      />
    </View>
  )
}
