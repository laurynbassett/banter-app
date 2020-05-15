import React from "react";
import { connect } from "react-redux";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { registerForPushNotificationsAsync } from "../store/user";
import ChatListItem from "../components/ChatListItem";
import { fetchAllChats, setCurrentChat } from "../store/chats";

class ChatListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.goToSingleChat = this.goToSingleChat.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllChats();
    this.props.registerNotification();
  }

  goToSingleChat(chatId) {
    // set current chatroom in redux
    this.props.setCurrentChat(chatId);

    // navigate to single chat page
    this.props.navigation.navigate("SingleChat");
  }

  sendPushNotification = async () => {
    const message = {
      to: this.state.expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { data: "goes here" },
      _displayInForeground: true,
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  render() {
    console.log("RENDER", this.props.chatrooms);
    return (
      <FlatList
        data={this.props.chats}
        renderItem={({ item }) => (
          <ChatListItem item={item} goToSingleChat={this.goToSingleChat} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

const mapState = (state) => ({
  chats: state.chats.chats,
});

const mapDispatch = (dispatch) => ({
  fetchAllChats: () => dispatch(fetchAllChats()),
  setCurrentChat: (chatId) => dispatch(setCurrentChat(chatId)),
  registerNotification: () => dispatch(registerForPushNotificationsAsync()),
});

export default connect(mapState, mapDispatch)(ChatListScreen);
