import React, {Component} from 'react'
import {
  Fragment,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import {GiftedChat, MessageText} from 'react-native-gifted-chat'
import {connect} from 'react-redux'
import {Audio} from 'expo-av'
import {AntDesign, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'

import Layout from '../constants/Layout'
import {
  fetchEarlierMessages,
  fetchMessages,
  postMessage,
  postAudio,
} from '../store'
import {db} from '../Firebase'
import {
  formatText,
  genUUID,
  getPlaybackTime,
  handleRecordPressed,
  handleToggleRecording,
  handleToggleAudio,
  getPermissions,
  stopRecording,
} from '../utils'

class SingleChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentChatId: this.props.currentChat.id || '',
      originalsShown: {},
      transcription: [],
      audioPermission: false,
      audioUrl: null,
      isRecording: false,
      isRecordingPlaying: false,
      recording: null,
      sound: null,
      currentAudio: null,
      isAudioPlaying: false,
      isLoading: false,
      playbackInstance: null,
      playbackInstanceId: null,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
    }
    this.loadPlaybackInstance = this.loadPlaybackInstance.bind(this)
    this.updatePlaybackStatus = this.updatePlaybackStatus.bind(this)
    this.updateSoundStatus = this.updateSoundStatus.bind(this)
    this.updateRecordingStatus = this.updateRecordingStatus.bind(this)
    this.handleSendAudio = this.handleSendAudio.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
  }

  componentDidMount() {
    // fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
    this.focusUnsubscribe = this.props.navigation.addListener('focus', () => {
      // fetch messages for current chat when in focus
      this.props.fetchMessages()
    })

    this.blurUnsubscribe = this.props.navigation.addListener('blur', () => {
      // unsubscribe from firebase listener when chat is not in focus
      if (this.state.currentChatId) {
        db.ref(`messages/${this.state.currentChatId}`).off('child_added')
      }
    })

    // get permission to access microphone for audio recordings
    getPermissions(this)
  }

  componentWillUnmount() {
    // turn off navigation listeners
    this.focusUnsubscribe()
    this.blurUnsubscribe()
  }

  // custom icons for recording to the left of the message composer
  renderActions(props) {
    return (
      <View style={styles.inputBar}>
        <View style={styles.inputLeft}>
          <TouchableOpacity
            onPress={() => handleRecordPressed(this)}
            hitSlop={styles.hitSlop}
          >
            <MaterialCommunityIcons
              name="microphone"
              size={28}
              color={this.state.isRecording ? 'red' : '#7a7a7a'}
              style={styles.microphone}
            />
          </TouchableOpacity>
          {this.state.recording && (
            <TouchableOpacity
              onPress={() => handleToggleRecording(this)}
              hitSlop={styles.hitSlop}
            >
              <Ionicons
                name={this.state.isRecordingPlaying ? 'ios-pause' : 'ios-play'}
                size={28}
                color="#7a7a7a"
                style={styles.playPause}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  // custom text bubble for audio files
  renderMessageAudio(props) {
    // TODO: get isCurrentPlaying to work for all audio files (currently only working for first)
    if (props.currentMessage.audio) {
      const {_id, transcript} = props.currentMessagesol
      return (
        <View style={styles.audioContainer}>
          <View style={styles.audioFileContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({currentAudio: _id})
                handleToggleAudio(props.currentMessage, this)
              }}
              hitSlop={styles.hitSlop}
            >
              <AntDesign
                name={
                  this.state.currentAudio === _id && this.state.isAudioPlaying
                    ? 'pausecircleo'
                    : 'playcircleo'
                }
                size={35}
                color="#ffffff"
                style={styles.audio}
              />
            </TouchableOpacity>
            {this.state.currentAudio === _id && (
              <Text style={styles.audioTime}>{getPlaybackTime(this)}</Text>
            )}
          </View>
          <View style={styles.audioTextContainer}>
            <Text
              style={styles.audioText}
            >{`Transcription: ${transcript}`}</Text>
          </View>
        </View>
      )
    }
    return null
  }

  // custom text bubble for messages w/ translation
  renderMessageText(params) {
    return (
      <View>
        {this.state.originalsShown[params.currentMessage._id] && (
          <Text style={styles.originalMessage}>
            {params.currentMessage.original}
          </Text>
        )}
        {this.props.uid !== params.currentMessage.user._id && (
          <Fragment>
            {params.currentMessage.translatedFrom !== false && (
              <TouchableOpacity>
                <Text
                  style={styles.showButton}
                  onPress={() => {
                    if (this.state.originalsShown[params.currentMessage._id]) {
                      this.setState((prevState) => {
                        return {
                          originalsShown: {
                            ...prevState.originalsShown,
                            ...{
                              [params.currentMessage._id]: !this.state
                                .originalsShown[params.currentMessage._id],
                            },
                          },
                        }
                      })
                    } else {
                      this.setState((prevState) => {
                        return {
                          originalsShown: {
                            ...prevState.originalsShown,
                            ...{[params.currentMessage._id]: true},
                          },
                        }
                      })
                    }
                  }}
                >
                  {this.state.originalsShown[params.currentMessage._id]
                    ? 'Hide Original'
                    : 'Show Original'}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.messageBox}>
              {params.currentMessage.translatedFrom !== false
                ? `Translated From: ${params.currentMessage.translatedFrom}`
                : 'Not Translated'}
            </Text>
          </Fragment>
        )}
        <MessageText {...params} />
      </View>
    )
  }

  // update state sound status for recording
  updateSoundStatus(status) {
    if (status.didJustFinish) {
      this.state.sound.setStatusAsync({positionMillis: 0})
      this.setState({
        isRecordingPlaying: status.isPlaying,
      })
    } else if (status.isLoaded) {
      this.setState({
        isRecordingPlaying: status.isPlaying,
      })
    } else {
      if (status.error) {
        console.log('Error updating sound status: ', status.error)
      }
    }
  }

  // update state recording status
  updateRecordingStatus(status) {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
      })
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
      })
      if (!this.state.isLoading) {
        stopRecording(this)
      }
    }
  }

  // update state on playback
  async updatePlaybackStatus(status) {
    if (status.didJustFinish) {
      await this.state.playbackInstance.stopAsync()
      this.loadPlaybackInstance()
    } else if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        isAudioPlaying: status.isPlaying,
      })
    } else {
      if (status.error) {
        console.log('Error updating playback status: ', status.error)
      }
    }
  }

  // load playback instance
  async loadPlaybackInstance(props) {
    this.setState({isLoading: true})
    // if playback instance exists, unload and clear onPlaybackStatusUpdate
    if (this.state.playbackInstance !== null) {
      try {
        await this.state.playbackInstance.unloadAsync()
        this.state.playbackInstance.setOnPlaybackStatusUpdate(null)
        this.setState({
          playbackInstancePosition: null,
          playbackInstanceDuration: null,
          playbackInstance: null,
          playbackInstanceId: null,
        })
      } catch (err) {
        console.log('Error unloading playback instance', err)
      }
    }
    // construct and load new sound instance then play audio
    if (props) {
      try {
        const {sound} = await Audio.Sound.createAsync(
          {uri: props.audio},
          {isLooping: false, progressUpdateIntervalMillis: 50},
          this.updatePlaybackStatus
        )
        this.setState({
          playbackInstance: sound,
          playbackInstanceId: props._id,
        })
        this.state.playbackInstance.playAsync()
      } catch (err) {
        console.log('Error loading playback instance', err)
      }
    }
    this.setState({isLoading: false})
  }

  // dispatch send audio
  async handleSendAudio() {
    const {audioUrl} = this.state
    const fileName = `${genUUID()}.wav`
    const file = {
      name: fileName,
      type: 'audio/x-wav',
      uri: Platform.OS === 'ios' ? audioUrl : `file://${audioUrl}`,
    }
    const text = formatText(this.props)
    text.messageType = 'audio'
    this.props.postAudio(file, text)
  }

  // dispatch send message
  handleSendMessage(messages) {
    let text = formatText(this.props)
    text.message = messages[messages.length - 1].text
    text.messageType = 'message'
    this.props.postMessage(text)
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.props.messages}
          user={{
            _id: this.props.uid,
            name: this.props.displayName,
          }}
          onSend={this.handleSendMessage.bind(this)}
          renderActions={this.renderActions.bind(this)}
          alignTop={true}
          isTyping={true}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          placeholder="Type a message..."
          inverted={false}
          renderMessageAudio={this.renderMessageAudio.bind(this)}
          renderMessageText={this.renderMessageText.bind(this)}
          loadEarlier={true}
          infiniteScroll={false}
          isLoadingEarlier={false}
          onLoadEarlier={() => {
            this.props.fetchEarlierMessages()
          }}
          renderLoading={() => {
            return <Text>Loading Messages...</Text>
          }}
        />
        {this.state.recording && (
          <View style={styles.inputRight}>
            <TouchableOpacity style={styles.inputRightContainer}>
              <Text
                style={styles.inputRightText}
                onPress={this.handleSendAudio}
                hitSlop={styles.hitSlop}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const mapState = (state) => ({
  messages: state.messages.messages,
  uid: state.firebase.auth.uid,
  displayName: state.user.name,
  currentChat: state.chats.currentChat,
})

const mapDispatch = (dispatch) => ({
  fetchEarlierMessages: () => dispatch(fetchEarlierMessages()),
  fetchMessages: () => dispatch(fetchMessages()),
  postMessage: (msg) => dispatch(postMessage(msg)),
  postAudio: (file, text) => dispatch(postAudio(file, text)),
})

export default connect(mapState, mapDispatch)(SingleChat)

const styles = StyleSheet.create({
  messageBox: {
    color: 'grey',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  originalMessage: {
    color: 'black',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1,
  },
  showButton: {
    color: 'rgb(102, 153, 255)',
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  inputBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
    alignItems: 'center',
  },
  inputLeft: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  inputRightContainer: {
    height: 44,
  },
  inputRight: {
    top: Layout.window.height * 0.76,
    left: Layout.window.width * 0.85,
    position: 'absolute',
    marginRight: 15,
    marginBottom: 10,
  },
  inputRightText: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
  },
  microphone: {
    marginBottom: 8,
  },
  playPause: {
    marginLeft: 15,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sendContainer: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitSlop: {
    top: 30,
    bottom: 30,
    left: 10,
    right: 10,
  },
  audioContainer: {
    flexDirection: 'column',
  },
  audioFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 150,
  },
  audio: {
    alignSelf: 'center',
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  audioTextContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  audioText: {
    color: '#ffffff',
    fontSize: 16,
  },
  audioTime: {
    marginTop: 10,
    marginLeft: 10,
    color: '#ffffff',
  },
})
