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
import { formatText, recordingCallback, setAudioMode } from "../utils";

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
			soundPosition: null,
			soundDuration: null,
			audioUrl: null
		};
		this.recording = null;
		this.sound = null;
		this.renderActions = this.renderActions.bind(this);
		this.renderBubble = this.renderBubble.bind(this);
		this.renderAudio = this.renderAudio.bind(this);
		this.handleSendAudio = this.handleSendAudio.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
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
						name={this.state.isPlaying ? "pause" : "play"}
						size={23}
						style={styles.microphone}
						color='#7a7a7a'
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
			// create new Audio instance
			const recording = new Audio.Recording();
			// Sets a cb to be called regularly w/ the status of the recording
			recording.setOnRecordingStatusUpdate(recordingCallback);
			// loads the recorder into memory and prepares it for recording
			await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
			// set recording in constructor
			this.recording = recording;
			// begin recording
			await this.recording.startAsync();
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
			// stops recording and deallocates recorder from memory
			await this.recording.stopAndUnloadAsync();
			// customizes audio experience on iOS and Android
			await setAudioMode({ allowsRecordingIOS: false });

			if (this.recording) {
				const audioUrl = this.recording.getURI();
				this.recording.setOnRecordingStatusUpdate(null);
				this.setState({ audioUrl });
				// creates and loads a new sound object to play back the recording
				const { sound, status } = await this.recording.createNewLoadedSoundAsync(
					{ isLooping: false },
					this.updateScreenForSoundStatus
				);
				this.sound = sound;
			}

			console.log("STOPPED RECORDING", this.state);

			this.setState({
				isLoading: false
			});
		} catch (err) {
			console.log("Error stopping recording: ", err);
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
