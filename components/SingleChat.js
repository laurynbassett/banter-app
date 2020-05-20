import React, { Component } from "react";
import { Fragment, Platform, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { GiftedChat, MessageText } from "react-native-gifted-chat";
import { connect } from "react-redux";
import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";

import Layout from "../constants/Layout";
import { fetchMessages, postMessage, postAudio } from "../store";
import { formatText, genUUID, setAudioMode, getMillis } from "../utils";

class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChatId: this.props.currentChat.id,
      originalsShown: {},
      audioPermission: false,
      audioUrl: null,
      isRecording: false,
      isRecordingPlaying: false,
      isAudioPlaying: false,
      isLoading: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null
    };
    this.recording = null;
    this.playbackInstance = null;
    this.playbackInstanceId = null;
    this.sound = null;
    this.handleSendAudio = this.handleSendAudio.bind(this);
    this.updateSoundStatus = this.updateSoundStatus.bind(this);
    this.updateRecordingStatus = this.updateRecordingStatus.bind(this);
    this.updatePlaybackStatus = this.updatePlaybackStatus.bind(this);
    this.loadPlaybackInstance = this.loadPlaybackInstance.bind(this);
    this.getPlaybackTime = this.getPlaybackTime.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.handleRecordPressed = this.handleRecordPressed.bind(this);
    this.handleToggleRecording = this.handleToggleRecording.bind(this);
    this.handleToggleAudio = this.handleToggleAudio.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  async componentDidMount() {
    // fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
    this.focusUnsubscribe = this.props.navigation.addListener("focus", () => {
      // fetch messages for current chat when in focus
      this.props.fetchMessages();
    });

    this.blurUnsubscribe = this.props.navigation.addListener("blur", () => {
      // unsubscribe from firebase listener when chat is not in focus
      db.ref(`messages/${this.state.currentChatId}`).off("child_added");
    });

    // get permission to access microphone for audio recordings
    this.getPermissions();
  }

  componentWillUnmount() {
    // turn off navigation listeners
    this.focusUnsubscribe();
    this.blurUnsubscribe();
  }

  // permission for microphone use
  async getPermissions() {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      audioPermission: response.status === "granted"
    });
  }

  // custom icons for recording to the left of the message composer
  renderActions(props) {
    return (
      <View style={styles.inputBar}>
        <View style={styles.inputLeft}>
          <MaterialCommunityIcons
            reverse
            name='microphone'
            size={28}
            style={styles.microphone}
            color={this.state.isRecording ? "red" : "#7a7a7a"}
            onPress={this.handleRecordPressed}
            hitSlop={styles.hitSlop}
          />
          {this.recording && (
            <FontAwesome
              name={this.state.isRecordingPlaying ? "pause" : "play"}
              size={23}
              color='#7a7a7a'
              style={styles.playPause}
              onPress={this.handleToggleRecording}
              hitSlop={styles.hitSlop}
            />
          )}
        </View>
      </View>
    );
  }

  // get time for playback
  getPlaybackTime() {
    if (
      this.playbackInstanceId !== null &&
      this.state.playbackInstancePosition !== null &&
      this.state.playbackInstanceDuration !== null
    ) {
      return `${getMillis(this.state.playbackInstancePosition)} / ${getMillis(this.state.playbackInstanceDuration)}`;
    }
    return "";
  }

  // custom text bubble for audio files
  renderMessageAudio(props) {
    if (props.currentMessage.audio) {
      const isPlayingCurrent = this.playbackInstanceId === props.currentMessage._id;
      return (
        <View style={styles.audioContainer}>
          <AntDesign
            name={isPlayingCurrent && this.state.isAudioPlaying ? "pausecircleo" : "playcircleo"}
            size={35}
            color='#ffffff'
            style={styles.audio}
            hitSlop={styles.hitSlop}
            onPress={() => {
              this.handleToggleAudio(props.currentMessage);
            }}
          />
          {isPlayingCurrent && <Text style={styles.audioText}>{this.getPlaybackTime()}</Text>}
        </View>
      );
    }
    return null;
  }

  // update state on playback
  async updatePlaybackStatus(status) {
    if (status.didJustFinish) {
      this.playbackInstance.stopAsync();
      this.loadPlaybackInstance(false);
    } else if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        isAudioPlaying: status.isPlaying
      });
    } else {
      if (status.error) {
        console.log("Error updating playback status: ", status.error);
      }
    }
  }

  // load playback instance
  async loadPlaybackInstance(shouldPlay, props) {
    this.setState({ isLoading: true });
    // if playback instance exists, unload and clear onPlaybackStatusUpdate
    if (this.playbackInstance !== null) {
      try {
        await this.playbackInstance.unloadAsync();
        this.playbackInstance.setOnPlaybackStatusUpdate(null);
        this.playbackInstance = null;
        this.playbackInstanceId = null;
        this.setState({
          playbackInstancePosition: null,
          playbackInstanceDuration: null
        });
      } catch (err) {
        console.log("Error unloading playback instance", err);
      }
    }
    // load new playback instance then play audio
    if (props) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: props.audio },
          { isLooping: false },
          this.updatePlaybackStatus
        );
        this.playbackInstance = sound;
        this.playbackInstanceId = props._id;
        this.playbackInstance.playAsync();
        this.setState({ isLoading: false });
      } catch (err) {
        console.log("Error loading playback instance", err);
      }
    }
  }

  // play / pause playback for message audio
  handleToggleAudio(props) {
    // if playback instance exists and is playing, pause it
    if (this.playbackInstance !== null) {
      if (this.state.isAudioPlaying) {
        this.playbackInstance.pauseAsync();
      } else this.playbackInstance.playAsync();
      // if no playback instance, load selected audio
    } else {
      this.loadPlaybackInstance(true, props);
    }
  }

  // render message text
  renderMessageText(params) {
    return (
      <View>
        {this.state.originalsShown[params.currentMessage._id] && (
          <Text style={styles.originalMessage}>{params.currentMessage.original}</Text>
        )}
        {this.props.uid !== params.currentMessage.user._id && (
          <Fragment>
            {params.currentMessage.translatedFrom !== false && (
              <TouchableOpacity>
                <Text
                  style={styles.showButton}
                  onPress={() => {
                    if (this.state.originalsShown[params.currentMessage._id]) {
                      this.setState(prevState => {
                        return {
                          originalsShown: {
                            ...prevState.originalsShown,
                            ...{
                              [params.currentMessage._id]: !this.state.originalsShown[params.currentMessage._id]
                            }
                          }
                        };
                      });
                    } else {
                      this.setState(prevState => {
                        return {
                          originalsShown: {
                            ...prevState.originalsShown,
                            ...{ [params.currentMessage._id]: true }
                          }
                        };
                      });
                    }
                  }}
                >
                  {this.state.originalsShown[params.currentMessage._id] ? "Hide Original" : "Show Original"}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.messageBox}>
              {params.currentMessage.translatedFrom !== false ? (
                `Translated From: ${params.currentMessage.translatedFrom}`
              ) : (
                "Not Translated"
              )}
            </Text>
          </Fragment>
        )}
        <MessageText {...params} />
      </View>
    );
  }

  // update state sound status for recording
  updateSoundStatus(status) {
    if (status.isLoaded) {
      this.setState({
        isRecordingPlaying: status.isPlaying
      });
    } else {
      if (status.error) {
        console.log("Error updating sound status: ", status.error);
      }
    }
  }

  // update state recording status
  updateRecordingStatus(status) {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false
      });
      if (!this.state.isLoading) {
        this.stopRecording();
      }
    }
  }

  // on start recording click
  async startRecording() {
    try {
      this.setState({
        isLoading: true
      });

      // if existing sound, unload the media from memory
      if (this.sound !== null) {
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null);
        this.sound = null;
      }
      // customizes audio experience on iOS and Android
      await setAudioMode({ allowsRecordingIOS: true });

      // sets interval that onRecordingStatusUpdate is called on while the recording can record
      if (this.recording !== null) {
        this.recording.setOnRecordingStatusUpdate(null);
        this.recording = null;
      }
      // create new Audio instance
      const recording = new Audio.Recording();
      // loads the recorder into memory and prepares it for recording
      await recording.prepareToRecordAsync(JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)));
      // Sets a cb to be called regularly w/ the status of the recording
      recording.setOnRecordingStatusUpdate(this.updateRecordingStatus);
      // set recording in constructor
      this.recording = recording;
      // begin recording
      await this.recording.startAsync();

      this.setState({
        isLoading: false
      });
    } catch (err) {
      console.log("Error starting recording: ", err);
    }
  }

  // on stop recording click
  async stopRecording() {
    try {
      this.setState({
        isLoading: true
      });
      // stops recording and deallocates recorder from memory
      await this.recording.stopAndUnloadAsync();
      // customizes audio experience on iOS and Android
      await setAudioMode({ allowsRecordingIOS: false });

      if (this.recording) {
        const audioUrl = this.recording.getURI();
        this.recording.setOnRecordingStatusUpdate(null);
        this.setState({ audioUrl });
      }
      // creates and loads a new sound object to play back the recording
      const { sound, status } = await this.recording.createNewLoadedSoundAsync(
        { isLooping: false },
        this.updateSoundStatus
      );
      this.sound = sound;
      this.setState({
        isLoading: false
      });
    } catch (err) {
      console.log("Error stopping recording: ", err);
    }
  }

  // start / stop recording
  handleRecordPressed() {
    this.state.isRecording ? this.stopRecording() : this.startRecording();
  }

  // play / pause playback for recording
  handleToggleRecording() {
    if (this.recording != null) {
      if (this.state.isRecordingPlaying) {
        this.sound.pauseAsync();
        this.setState({ isRecordingPlaying: false });
      } else {
        this.setState({ isRecordingPlaying: true });
        this.sound.playAsync();
      }
    }
  }

  // dispatch send audio
  async handleSendAudio() {
    const { audioUrl } = this.state;
    const fileName = `${genUUID()}.aac`;
    const file = {
      name: fileName,
      type: "audio/aac",
      uri: Platform.OS === "ios" ? audioUrl : `file://${audioUrl}`
    };
    const text = formatText(this.props);
    text.messageType = "audio";
    this.props.postAudio(file, text);
  }

  // dispatch send message
  handleSendMessage(messages) {
    let text = formatText(this.props);
    text.message = messages[messages.length - 1].text;
    text.messageType = "message";
    this.props.postMessage(text);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>{this.props.sendMessageError}</Text>
        <GiftedChat
          messages={this.props.messages}
          user={{
            _id: this.props.uid,
            name: this.props.displayName
          }}
          onSend={this.handleSendMessage.bind(this)}
          renderActions={this.renderActions.bind(this)}
          alignTop={true}
          isTyping={true}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          placeholder='Type a message...'
          inverted={false}
          renderMessageAudio={this.renderMessageAudio.bind(this)}
          renderMessageText={this.renderMessageText.bind(this)}
        />
        {this.recording && (
          <View style={styles.inputRight}>
            <TouchableOpacity color='#0084ff'>
              <Text style={styles.inputRightText} onPress={this.handleSendAudio} hitSlop={styles.hitSlop}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapState = state => ({
  messages: state.messages.messages,
  uid: state.firebase.auth.uid,
  displayName: state.user.name,
  currentChat: state.chats.currentChat,
  sendMessageError: state.messages.sendMessageError
});

const mapDispatch = dispatch => ({
  fetchMessages: () => dispatch(fetchMessages()),
  postMessage: msg => dispatch(postMessage(msg)),
  postAudio: (file, text) => dispatch(postAudio(file, text))
});

export default connect(mapState, mapDispatch)(SingleChat);

const styles = StyleSheet.create({
  messageBox: {
    color: "grey",
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1
  },
  originalMessage: {
    color: "black",
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1
  },
  showButton: {
    color: "rgb(102, 153, 255)",
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
    // width: Layout.window.width,
    // height: Layout.window.height * 0.85,
  },
  inputBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
    alignItems: "center"
  },
  inputLeft: {
    flexDirection: "row",
    marginLeft: 15
  },
  inputRight: {
    top: Layout.window.height * 0.76,
    left: Layout.window.width * 0.85,
    position: "absolute",
    marginRight: 15,
    marginBottom: 10
  },
  inputRightText: {
    fontWeight: "600",
    fontSize: 17,
    color: "#0084ff"
  },
  microphone: {
    marginBottom: 10
  },
  playPause: {
    marginLeft: 15,
    marginBottom: 10
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4
  },
  sendContainer: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 50,
    right: 50
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: 150
  },
  audio: {
    alignSelf: "center",
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: "transparent"
  },
  audioText: {
    marginTop: 10,
    marginLeft: 10,
    color: "#ffffff"
  }
});
