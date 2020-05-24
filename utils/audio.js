import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {AntDesign} from '@expo/vector-icons'

// format audio time
export function getMillis(millis) {
  const totalSecs = millis / 1000
  const secs = Math.floor(totalSecs % 60)
  const mins = Math.floor(totalSecs / 60)
  const pad = (num) => {
    const str = num.toString()
    if (num < 10) return '0' + str
    return str
  }
  return `${pad(mins)}:${pad(secs)}`
}

// get time for playback
export function getPlaybackTime(thisObj) {
  if (
    thisObj.state.playbackInstanceId !== null &&
    thisObj.state.playbackInstancePosition !== null &&
    thisObj.state.playbackInstanceDuration !== null
  ) {
    return `${getMillis(thisObj.state.playbackInstancePosition)} / ${getMillis(
      thisObj.state.playbackInstanceDuration
    )}`
  }
  return ''
}

// play / pause playback for message audio
async function handleToggleAudio(currMessage, thisObj) {
  const {isAudioPlaying, playbackInstance} = thisObj.state
  // if playback instance exists and is playing, pause it
  playbackInstance !== null
    ? isAudioPlaying
      ? await playbackInstance.pauseAsync()
      : await playbackInstance.playAsync()
    : // if no playback instance, load selected audio
      thisObj.loadPlaybackInstance(currMessage)
}

export function playbackIcon(thisObj, currentMessage, isSender) {
  const time = isSender ? styles.audioTimeRight : styles.audioTimeLeft
  const color = isSender ? '#ffffff' : '#0084ff'
  return (
    <View style={styles.audioFileContainer}>
      <TouchableOpacity
        onPress={() => {
          thisObj.setState({currentAudio: currentMessage._id})
          handleToggleAudio(currentMessage, thisObj)
        }}
        hitSlop={styles.hitSlop}
      >
        <AntDesign
          name={
            thisObj.state.currentAudio === currentMessage._id &&
            thisObj.state.isAudioPlaying
              ? 'pausecircleo'
              : 'playcircleo'
          }
          size={35}
          color={color}
          style={styles.audio}
        />
      </TouchableOpacity>
      {thisObj.state.currentAudio === currentMessage._id && (
        <Text style={time}>{getPlaybackTime(thisObj)}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  audioFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 150,
    paddingLeft: 10,
    paddingRight: 10,
  },
  audio: {
    alignSelf: 'center',
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  audioTimeLeft: {
    marginTop: 10,
    marginLeft: 10,
    color: 'black',
  },
  audioTimeRight: {
    marginTop: 10,
    marginLeft: 10,
    color: '#ffffff',
  },
  hitSlop: {
    top: 30,
    bottom: 30,
    left: 10,
    right: 10,
  },
})
