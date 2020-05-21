import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";

// format audio time
export function getMillis(millis) {
  const totalSecs = millis / 1000;
  const secs = Math.floor(totalSecs % 60);
  const mins = Math.floor(totalSecs / 60);
  const pad = num => {
    const str = num.toString();
    if (num < 10) return "0" + str;
    return str;
  };
  return `${pad(mins)}:${pad(secs)}`;
};

// permission for microphone use
export async function getPermissions(thisObj) {
  const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  thisObj.setState({
    audioPermission: response.status === "granted"
  });
}

// get time for playback
export function getPlaybackTime(thisObj) {
  if (
    thisObj.playbackInstanceId !== null &&
    thisObj.state.playbackInstancePosition !== null &&
    thisObj.state.playbackInstanceDuration !== null
  ) {
    return `${getMillis(thisObj.state.playbackInstancePosition)} / ${getMillis(
      thisObj.state.playbackInstanceDuration
    )}`;
  }
  return "";
}

// play / pause playback for message audio
export function handleToggleAudio(props, thisObj) {
  if (thisObj.state.audioFiles[props._id]) {
    thisObj.setState(prevState => ({
      audioFiles: {
        ...prevState.audioFiles,
        ...{ [props._id]: !thisObj.state.audioFiles[props._id] }
      }
    }));
  } else {
    thisObj.setState(prevState => ({
      audioFiles: {
        ...prevState.audioFiles,
        ...{ [props._id]: true }
      }
    }));
  }

  // if playback instance exists and is playing, pause it
  if (thisObj.playbackInstance !== null) {
    if (thisObj.state.isAudioPlaying) {
      thisObj.playbackInstance.pauseAsync();
    } else thisObj.playbackInstance.playAsync();
    // if no playback instance, load selected audio
  } else {
    thisObj.loadPlaybackInstance(props);
  }
}
