import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat, MessageText, Message } from "react-native-gifted-chat";
import { connect } from "react-redux";

import Layout from "../constants/Layout";
import { fetchMessages, postMessage } from "../store";
class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  async componentDidMount() {
    // fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
    this.props.fetchMessages();
  }

  handleSendMessage(messages) {
    const { currentChat, displayName, postMessage, route, uid } = this.props;
    const contactId = route.params.contactId;
    const contactName = route.params.name;
    const message = messages[messages.length - 1].text;
    const timestamp = Date.now();
    const currChatId = currentChat ? currentChat.id : "";
    postMessage({
      uid,
      displayName,
      contactId,
      contactName,
      currChatId,
      message,
      timestamp,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>{this.props.sendMessageError}</Text>
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
          placeholder="Type a message..."
          inverted={false}
          renderMessageText={(params) => {
            console.log(params.currentMessage);
            return (
              <View>
                {this.props.uid !== params.currentMessage.user._id && (
                  <Text style={styles.messageBox}>
                    Translated From: {params.currentMessage.translatedFrom}
                  </Text>
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

const mapState = (state) => ({
  messages: state.messages.messages,
  uid: state.firebase.auth.uid,
  displayName: state.firebase.auth.displayName,
  currentChat: state.chats.currentChat,
  sendMessageError: state.messages.sendMessageError,
});

const mapDispatch = (dispatch) => ({
  fetchMessages: () => dispatch(fetchMessages()),
  postMessage: (msg) => dispatch(postMessage(msg)),
});

export default connect(mapState, mapDispatch)(SingleChat);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    width: Layout.window.width,
    height: Layout.window.height * 0.75,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 1,
    paddingBottom: 4,
  },
  messageBox: {
    color: "grey",
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1,
  },
});
