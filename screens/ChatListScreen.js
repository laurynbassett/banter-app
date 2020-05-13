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

import ChatListItem from "../components/ChatListItem";
import { fetchAllChats, setCurrentChat } from "../store/chats";

class ChatListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.goToSingleChat = this.goToSingleChat.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllChats();
  }

  goToSingleChat(chatId) {
    // set current chatroom in redux
    this.props.setCurrentChat(chatId);

    // navigate to single chat page
    this.props.navigation.navigate("SingleChat");
  }

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
});

export default connect(mapState, mapDispatch)(ChatListScreen);
