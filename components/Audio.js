import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";

import Layout from "../constants/Layout";
import { fetchMessages, postMessage, postAudio } from "../store";
import { formatText } from "../utils";

class SingleChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentChatId: this.props.currentChat.id,
			originalsShown: {},
			audioPermission: false,
			isRecording: false,
			isPlaying: false,
			isLoading: false,
			isPlaybackAllowed: false,
			muted: false,
			soundPosition: null,
			soundDuration: null,
			recordingDuration: null,
			audioUrl: null
		};
		this.recording = null;
		this.sound = null;
		this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
		this.renderActions = this.renderActions.bind(this);
		this.renderBubble = this.renderBubble.bind(this);
		this.renderAudio = this.renderAudio.bind(this);
		this.handleSendAudio = this.handleSendAudio.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.updateScreenForSoundStatus = this.updateScreenForSoundStatus.bind(this);
		this.updateScreenForRecordingStatus = this.updateScreenForRecordingStatus.bind(this);
		this.setAudioMode = this.setAudioMode.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.handleRecordPressed = this.handleRecordPressed.bind(this);
		this.handlePlayPausePressed = this.handlePlayPausePressed.bind(this);
	}

	async componentDidMount() {
		// fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
		await this.props.fetchMessages();
		this.getPermissions();
		this.setState({ messages: this.props.messages });
	}

	getPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		this.setState({
			audioPermission: response.status === "granted"
		});
	};

	renderActions(props) {
		return (
			<View style={styles.inputContainer}>
				<FontAwesome
					name='microphone'
					size={23}
					style={styles.microphone}
					color={this.state.isRecording ? "red" : "#7a7a7a"}
					onPress={this.handleRecordPressed}
					hitSlop={styles.hitSlop}
				/>
				{this.recording && (
					<FontAwesome
						name={this.state.isPlaying ? "stop" : "play"}
						size={23}
						style={styles.microphone}
						color={this.state.isPlaying ? "red" : "#7a7a7a"}
						onPress={this.handlePlayPausePressed}
						hitSlop={styles.hitSlop}
					/>
				)}
			</View>
		);
	}

	renderBubble(props) {
		console.log("RENDER BUBBLE PROPS", props);
		return (
			<View>
				{this.renderAudio(props)}
				<Bubble {...props} />
			</View>
		);
	}

	renderAudio = props => {
		return !props.currentMessage.audio ? (
			<View />
		) : (
			<FontAwesome
				name='play'
				size={35}
				color={this.state.isPlaying ? "red" : "black"}
				style={style.audio}
				onPress={this.handlePlayPausePressed}
			/>
		);
	};

	async handleSendAudio() {
		if (!this.state.isRecording) {
			this.setState({ isRecording: true });
			this.startRecording();
		} else {
			this.setState({ isRecording: true });
			this.stopRecording();
			const { audioUrl } = this.state;
			const fileName = `${genUUID()}.aac`;
			const file = {
				name: fileName,
				type: "audio/aac",
				uri: Platform.OS === "ios" ? audioUrl : `file://${audioUrl}`
			};
			const text = formatText(this.props);
			dispatch(postAudio(file, text));
		}
	}

	updateScreenForSoundStatus = status => {
		if (status.isLoaded) {
			this.setState({
				soundDuration: status.durationMillis,
				soundPosition: status.positionMillis,
				shouldPlay: status.shouldPlay,
				isPlaying: status.isPlaying,
				rate: status.rate,
				muted: status.isMuted,
				volume: status.volume,
				shouldCorrectPitch: status.shouldCorrectPitch,
				isPlaybackAllowed: true
			});
		} else {
			this.setState({
				soundDuration: null,
				soundPosition: null,
				isPlaybackAllowed: false
			});
			if (status.error) {
				console.log(`FATAL PLAYER ERROR: ${status.error}`);
			}
		}
	};

	updateScreenForRecordingStatus = status => {
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
	};

	// customizes the audio experience on iOS and Android
	async setAudioMode({ allowsRecordingIOS }) {
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
	}

	// on start recording click
	async startRecording() {
		try {
			this.setAudioMode({ allowsRecordingIOS: true });

			const recording = new Audio.Recording();
			await recording.prepareToRecordAsync(this.recordingSettings);
			recording.setOnRecordingStatusUpdate(this.updateScreenForRecordingStatus);

			this.recording = recording;
			await this.recording.startAsync(); // Will call this.updateScreenForRecordingStatus to update the screen.
			this.setState({
				isLoading: false
			});
		} catch (err) {
			console.log("Error setting audio mode: ", err);
		}
	}

	// on stop recording click
	async stopRecording() {
		try {
			this.setState({
				isLoading: true
			});
			await this.recording.stopAndUnloadAsync();
			this.setAudioMode({ allowsRecordingIOS: false });

			if (this.recording) {
				const audioUrl = this.recording.getURI();
				this.recording.setOnRecordingStatusUpdate(null);
				this.setState({ audioUrl });
				const { sound, status } = await this.recording.createNewLoadedSoundAsync(
					{
						isLooping: true,
						isMuted: this.state.muted,
						volume: this.state.volume,
						rate: this.state.rate,
						shouldCorrectPitch: this.state.shouldCorrectPitch
					},
					this._updateScreenForSoundStatus
				);
				this.sound = sound;
			}
			console.log("STOPPED RECORDING", this.state);
			this.setState({
				isLoading: false
			});
		} catch (err) {
			console.log(err);
		}
	}

	handleRecordPressed = () => {
		if (this.state.isRecording) {
			this.stopRecording();
		} else {
			this.startRecording();
		}
	};

	handlePlayPausePressed = () => {
		if (this.recording != null) {
			if (this.state.isPlaying) {
				this.sound.pauseAsync();
			} else {
				this.sound.playAsync();
			}
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={{ color: "red" }}>{this.props.sendMessageError}</Text>
				<GiftedChat
					messages={this.state.messages}
					user={{
						_id: this.props.uid,
						name: this.props.displayName
					}}
					onSend={this.handleSendMessage}
					renderActions={this.renderActions}
					inverted={false}
					alignTop={true}
					isTyping={true}
					showUserAvatar={true}
					showAvatarForEveryMessage={true}
					placeholder='Type a message...'
				/>
			</View>
		);
	}
}

const mapState = state => ({
	messages: state.messages.messages,
	uid: state.firebase.auth.uid,
	displayName: state.firebase.auth.displayName,
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
	container: {
		backgroundColor: "#fafafa",
		width: Layout.window.width,
		height: Layout.window.height * 0.85
	},
	headerContainer: {
		flexDirection: "row",
		backgroundColor: "#fafafa",
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 4,
		paddingBottom: 4
	},
	inputContainer: {
		flexDirection: "row",
		height: 55
	},
	microphone: {
		marginLeft: 15,
		alignSelf: "center"
	},
	inputToolbar: {
		// width: Layout.window.width *  0.8
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
