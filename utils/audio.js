import {Audio} from 'expo-av'
import * as Permissions from 'expo-permissions'

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

// permission for microphone use
export async function getPermissions(thisObj) {
  const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
  thisObj.setState({
    audioPermission: response.status === 'granted',
  })
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
export async function handleToggleAudio(props, thisObj) {
  const {isAudioPlaying, playbackInstance} = thisObj.state
  // if playback instance exists and is playing, pause it
  playbackInstance !== null
    ? isAudioPlaying
      ? await playbackInstance.pauseAsync()
      : await playbackInstance.playAsync()
    : // if no playback instance, load selected audio
      thisObj.loadPlaybackInstance(props)
}
