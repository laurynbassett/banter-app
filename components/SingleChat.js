import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { connect } from "react-redux";

import Fire, { auth, db } from "../Firebase";
import Layout from "../constants/Layout";
import {
  fetchMessages,
  postMessage,
  subscribeToMessages,
} from "../store/messages";
class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  static navigationOptions = {
    header: "SINGLE",
  };

  async componentDidMount() {
    // fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
    await this.props.fetchMessages();
  }

  handleSendMessage(messages) {
    GiftedChat.append(this.props.messages, messages);
    const { uid, displayName } = this.props;
    const contactId = this.props.route.params
      ? this.props.route.params.contactId
      : "";
    const contactName = this.props.route.params
      ? this.props.route.params.name
      : "";
    const message = messages[messages.length - 1].text;
    const timestamp = Date.now();
    this.props.sendMessage({
      uid,
      displayName,
      message,
      timestamp,
      contactId,
      contactName,
    });
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
          onSend={this.handleSendMessage}
          alignTop={true}
          isTyping={true}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          inverted={false}
          placeholder="Type a message..."
        />
      </View>
    );
  }
}

const mapState = (state) => ({
  messages: state.messages.messages,
  uid: state.firebase.auth.uid,
  displayName: state.firebase.auth.displayName,
  currentChat: state.chats.currentChat,
});

const mapDispatch = (dispatch) => ({
  fetchMessages: () => dispatch(fetchMessages()),
  sendMessage: (msg) => dispatch(postMessage(msg)),
});

export default connect(mapState, mapDispatch)(SingleChat);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    width: Layout.window.width,
    height: Layout.window.height * 0.8,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
