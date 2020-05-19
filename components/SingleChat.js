import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Bubble, GiftedChat, MessageText, Send } from "react-native-gifted-chat";
import { connect } from "react-redux";
import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import * as Permissions from "expo-permissions";

import Layout from "../constants/Layout";
import { fetchMessages, postMessage, postAudio } from "../store";
import { formatText, genUUID, setAudioMode } from "../utils";

class SingleChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentChatId: this.props.currentChat.id,
			originalsShown: {},
			audioPermission: false,
			isRecording: false,
			recordingDuration: null,
			isPlaying: false,
			isLoading: false,
			audioUrl: null
		};
		this.recording = null;
		this.playbackInstance = null
		this.sound = null;
		this.renderActions = this.renderActions.bind(this);
		this.renderBubble = this.renderBubble.bind(this);
		this.renderAudio = this.renderAudio.bind(this);
		this.handleSendAudio = this.handleSendAudio.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.updateSoundStatus = this.updateSoundStatus.bind(this)
		this.updateRecordingStatus = this.updateRecordingStatus.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.handleRecordPressed = this.handleRecordPressed.bind(this);
		this.handlePlayPausePressed = this.handlePlayPausePressed.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
	}

	async componentDidMount() {
		// fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
		this.props.fetchMessages();
		this.getPermissions();
		try {
			const dloadUrl = 'https://firebasestorage.googleapis.com/v0/b/fsa-capstone-red-team.appspot.com/o/audio%2F7e21519e-8fda-477a-b2a9-2d99ca2f1d63.aac?alt=media&token=70b96380-03f4-45b4-8126-2079bd575fc4'
			const fileLoc = 'gs://fsa-capstone-red-team.appspot.com/audio/7e21519e-8fda-477a-b2a9-2d99ca2f1d63.aac'
			const audioObj = await FileSystem.downloadAsync(dloadUrl, FileSystem.documentDirectory + '7e21519e-8fda-477a-b2a9-2d99ca2f1d63.aac')
			console.log('****Finished downloading to ', audioObj.uri);
			const { sound, status } = await Audio.Sound.createAsync({ uri: audioObj.uri }, { isLooping: false, shouldPlay: true })
			console.log('SOUND', sound, status)
			this.playbackInstance = sound
			console.log('PLAYBACK INST', this.playbackInstance)
		} catch (err) {
			console.log('Error getting audio file: ', err)
		}
		// playbackObject.loadAsync({ uri: 'https://firebasestorage.googleapis.com/v0/b/fsa-capstone-red-team.appspot.com/o/audio%2F7e21519e-8fda-477a-b2a9-2d99ca2f1d63.aac?alt=media&token=70b96380-03f4-45b4-8126-2079bd575fc4' }, { isLooping: false, shouldPlay: true }, true)
	}

	getPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		this.setState({
			audioPermission: response.status === "granted"
		});
	};

	// send button for audio
	// renderSend(props) {
	// 	return this.audioUrl ? (
	// 		<Send {...props} onSend={this.handleSendAudio} containerStyle={styles.sendContainer}>
	// 			<AntDesign name='arrowup' size={24} color='black' />
	// 		</Send>
	// 	) : null;
	// }

	renderActions(props) {
		return (
			<View style={styles.inputBar}>
				<View style={styles.inputLeft}>
					<MaterialCommunityIcons
						reverse
						name='record-circle'
						size={23}
						style={styles.microphone}
						color={this.state.isRecording ? "red" : "#7a7a7a"}
						onPress={this.handlePlayPausePressed}
						// onPress={this.handleRecordPressed}
						hitSlop={styles.hitSlop}
					/>
					{this.playbackInstance && (
// {/* {this.recording && ( */}
						<FontAwesome
							name={this.state.isPlaying ? "pause" : "play"}
							size={23}
							color='#7a7a7a'
							style={styles.playPause}
							onPress={this.handlePlayPausePressed}
							hitSlop={styles.hitSlop}
						/>
					)}
				</View>
				<View style={styles.inputRight}>
					<AntDesign name='arrowup' size={24} color='#7a7a7a' style={styles.send} 							onPress={this.handleSendAudio} hitSlop={styles.hitSlop} />
				</View>
			</View>
		);
	}

	renderBubble = props => {
		console.log("RENDER BUBBLE PROPS", props);
		return (
			<View>
				<Text>HELLO</Text>
				{this.renderAudio(props)}
				<Bubble {...props} />
			</View>
		);
	};

	// inside chat audio icon
	renderAudio = props => {
		return !props.currentMessage.audio ? (
			<View />
		) : (
			<FontAwesome
				name={this.state.isPlaying ? "pause" : "play"}
				size={35}
				color={this.state.isPlaying ? "#2a2a2a" : '#7a7a7a'}
					style={style.audio}
						hitSlop={styles.hitSlop}
				onPress={this.handlePlayPausePressed}
			/>
		);
	};

	// update state sound status
	updateSoundStatus(status) {
		if (status.isLoaded) {
      this.setState({
        isPlaying: status.isPlaying,
      });
    } else {
      if (status.error) {
        console.log(`PLAYER ERROR: ${status.error}`);
      }
    }
	}

	// update state recording status
	updateRecordingStatus(status) {
		console.log("updateRecordingStatus", status);
		if (status.canRecord) {
			this.setState({
				isRecording: status.isRecording,
				recordingDuration: status.durationMillis
			});
		} else if (status.isDoneRecording) {
			this.setState({
				isRecording: false,
				recordingDuration: status.durationMillis
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

			console.log("STOPPED RECORDING", this.state);

			this.setState({
				isLoading: false
			});
		} catch (err) {
			console.log("Error stopping recording: ", err);
		}
	}

	// start / stop recording
	handleRecordPressed() {
		if (this.state.isRecording) {
			this.stopRecording();
		} else {
			this.startRecording();
		}
	};

	// play / pause playback
	handlePlayPausePressed() {
		if (this.recording != null || this.playbackInstance != null) {
			if (this.state.isPlaying) {
				// this.sound.pauseAsync();
				this.playbackInstance.pauseAsync()
				this.setState({isPlaying: false})
			} else {
				this.setState({ isPlaying: true })
				// this.sound.playAsync();
				this.playbackInstance.playAsync();
			}
		}
	};

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
		console.log("DISPATCHED AUDIO FILE", file);
		console.log("DISPATCHED AUDIO TEXT", text);
		this.props.postAudio(file, text)
	}

	handleSendMessage(messages) {
		let text = formatText(this.props);
		text.message = messages[messages.length - 1].text;
		text.messageType = "message";
		console.log("TEXT", text);
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
					onSend={this.handleSendMessage}
					// renderSend={this.renderSend}
					renderActions={this.renderActions}
					alignTop={true}
					isTyping={true}
					showUserAvatar={true}
					showAvatarForEveryMessage={true}
					placeholder='Type a message...'
					inverted={false}
					renderMessageText={params => {
						return (
							<View>
								{this.state.originalsShown[params.currentMessage._id] && (
									<Text style={styles.originalMessage}>{params.currentMessage.original}</Text>
								)}
								{this.props.uid !== params.currentMessage.user._id && (
                  <>
                    {params.currentMessage.translatedFrom !== false && (
                      <TouchableOpacity>
                        <Text
                          style={styles.showButton}
                          onPress={() => {
                            if (
                              this.state.originalsShown[
                                params.currentMessage._id
                              ]
                            ) {
                              this.setState((prevState) => {
                                return {
                                  originalsShown: {
                                    ...prevState.originalsShown,
                                    ...{
                                      [params.currentMessage._id]: !this.state
                                        .originalsShown[
                                        params.currentMessage._id
                                      ],
                                    },
                                  },
                                };
                              });
                            } else {
                              this.setState((prevState) => {
                                return {
                                  originalsShown: {
                                    ...prevState.originalsShown,
                                    ...{ [params.currentMessage._id]: true },
                                  },
                                };
                              });
                            }
                          }}
                        >
                          {this.state.originalsShown[params.currentMessage._id]
                            ? "Hide Original"
                            : "Show Original"}
                        </Text>
                      </TouchableOpacity>
                    )}
								<Text style={styles.messageBox}>
									{params.currentMessage.translatedFrom !== false ? (
										`Translated From: ${params.currentMessage.translatedFrom}`
									) : (
										"No Translation Available"
									)}
								</Text>
								</>
								)}
								<MessageText {...params} />
							</View>
						);
					}}
				/>
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
	postAudio: (file, text)=> dispatch(postAudio(file, text))
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
		flexDirection: "row",
		justifyContent: "space-between",
		width: Layout.window.width,
		alignItems: "center"
	},
	inputLeft: {
		flexDirection: "row",
		marginLeft: 20
		// marginBottom: 10
	},
	send: {},
	inputRight: {
		flexDirection: "row",
		marginRight: 15,
		marginBottom: 10
	},
	microphone: {
		marginBottom: 10,
	},
	playPause: {
		marginLeft: 25,
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
	audio: {
		left: 90,
		position: "relative",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		backgroundColor: "transparent"
	}
});
