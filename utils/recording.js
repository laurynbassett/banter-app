// play / pause playback for recording
export function handleToggleRecording(thisObj) {
  if (thisObj.recording != null) {
    if (thisObj.state.isRecordingPlaying) {
      thisObj.sound.pauseAsync();
      thisObj.setState({ isRecordingPlaying: false });
    } else {
      thisObj.setState({ isRecordingPlaying: true });
      thisObj.sound.playAsync();
    }
  }
}

// start / stop recording
export function handleRecordPressed(thisObj) {
  thisObj.state.isRecording ? stopRecording(thisObj) : startRecording(thisObj);
}

// on start recording click
async function startRecording(thisObj) {
  try {
    thisObj.setState({
      isLoading: true
    });

    // if existing sound, unload the media from memory
    if (thisObj.sound !== null) {
      await thisObj.sound.unloadAsync();
      thisObj.sound.setOnPlaybackStatusUpdate(null);
      thisObj.sound = null;
    }
    // customizes audio experience on iOS and Android
    await setAudioMode({ allowsRecordingIOS: true });

    // sets interval that onRecordingStatusUpdate is called on while the recording can record
    if (thisObj.recording !== null) {
      thisObj.recording.setOnRecordingStatusUpdate(null);
      thisObj.recording = null;
    }
    // create new Audio instance
    const recording = new Audio.Recording();
    // loads the recorder into memory and prepares it for recording
    await recording.prepareToRecordAsync(JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)));
    // Sets a cb to be called regularly w/ the status of the recording
    recording.setOnRecordingStatusUpdate(thisObj.updateRecordingStatus);
    // set recording in constructor
    thisObj.recording = recording;
    // begin recording
    await thisObj.recording.startAsync();

    thisObj.setState({
      isLoading: false
    });
  } catch (err) {
    console.log("Error starting recording: ", err);
  }
}

// customizes audio experience on iOS and Android
async function setAudioMode({ allowsRecordingIOS }) {
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

// on stop recording click
async function stopRecording(thisObj) {
  try {
    thisObj.setState({
      isLoading: true
    });
    // stops recording and deallocates recorder from memory
    await thisObj.recording.stopAndUnloadAsync();
    // customizes audio experience on iOS and Android
    await setAudioMode({ allowsRecordingIOS: false });

    if (thisObj.recording) {
      const audioUrl = thisObj.recording.getURI();
      thisObj.recording.setOnRecordingStatusUpdate(null);
      thisObj.setState({ audioUrl });
    }
    // creates and loads a new sound object to play back the recording
    const { sound } = await thisObj.recording.createNewLoadedSoundAsync(
      { isLooping: false },
      thisObj.updateSoundStatus
    );
    thisObj.sound = sound;
    thisObj.setState({
      isLoading: false
    });
  } catch (err) {
    console.log("Error stopping recording: ", err);
  }
}
