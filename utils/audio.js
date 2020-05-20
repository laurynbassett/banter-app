import { Audio } from "expo-av";

export const recordingCallback = {
  durationMillis: 0,
  isRecording: false,
  isDoneRecording: false
};

// customizes the audio experience on iOS and Android
export const setAudioMode = async ({ allowsRecordingIOS }) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });
  } catch (err) {
    console.log("Error setting audio mode: ", err);
  }
};

export const getMillis = millis => {
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
