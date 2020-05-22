import {Audio} from 'expo-av'
import * as Permissions from 'expo-permissions'

// permission for microphone use
export async function getPermissions(thisObj) {
  const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
  thisObj.setState({
    audioPermission: response.status === 'granted',
  })
}

// play / pause playback for recording
export async function handleToggleRecording(thisObj) {
  console.log('STATE', thisObj.state)
  const {recording, sound, isRecordingPlaying} = thisObj.state
  if (recording != null) {
    isRecordingPlaying ? await sound.pauseAsync() : await sound.playAsync()
  }
}

// start / stop recording
export function handleRecordPressed(thisObj) {
  thisObj.state.isRecording ? stopRecording(thisObj) : startRecording(thisObj)
}

// on start recording click
async function startRecording(thisObj) {
  try {
    thisObj.setState({
      isLoading: true,
    })

    // if existing sound, unload the media from memory
    if (thisObj.state.sound !== null) {
      await thisObj.state.sound.unloadAsync()
      thisObj.state.sound.setOnPlaybackStatusUpdate(null)
      thisObj.state.sound = null
    }

    // customizes audio experience on iOS and Android
    await setAudioMode({allowsRecordingIOS: true})

    // sets interval that onRecordingStatusUpdate is called on while the recording can record
    if (thisObj.state.recording !== null) {
      thisObj.state.recording.setOnRecordingStatusUpdate(null)
      thisObj.state.recording = null
    }
    // create new Audio instance
    const recording = new Audio.Recording()
    // loads the recorder into memory and prepares it for recording
    await recording.prepareToRecordAsync(recordingOptions)
    // Sets a cb to be called regularly w/ the status of the recording
    recording.setOnRecordingStatusUpdate(thisObj.updateRecordingStatus)
    // set recording in constructor
    thisObj.state.recording = recording
    // begin recording
    await thisObj.state.recording.startAsync()

    thisObj.setState({
      isLoading: false,
    })
  } catch (err) {
    console.log('Error starting recording: ', err)
  }
}

// on stop recording click
export async function stopRecording(thisObj) {
  try {
    thisObj.setState({
      isLoading: true,
    })
    // stops recording and deallocates recorder from memory
    await thisObj.state.recording.stopAndUnloadAsync()
    // customizes audio experience on iOS and Android
    await setAudioMode({allowsRecordingIOS: false})

    if (thisObj.state.recording) {
      const audioUrl = thisObj.state.recording.getURI()
      thisObj.state.recording.setOnRecordingStatusUpdate(null)
      thisObj.setState({audioUrl})

      // creates and loads a new sound object to play back the recording
      const {sound} = await thisObj.state.recording.createNewLoadedSoundAsync(
        {isLooping: false},
        thisObj.updateSoundStatus
      )
      thisObj.state.sound = sound
    }
    thisObj.setState({
      isLoading: false,
    })
  } catch (err) {
    console.log('Error stopping recording: ', err)
  }
}

// customizes audio experience on iOS and Android
async function setAudioMode({allowsRecordingIOS}) {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    })
  } catch (err) {
    console.log('Error setting audio mode: ', err)
  }
}

const recordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
}
