import React from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";
import { ChatListItem } from "../components";
import {
  fetchChats,
  fetchContacts,
  setCurrentChat,
  fetchUser,
  registerForPushNotificationsAsync,
} from "../store";

class ChatListScreen extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchContacts();
    this.props.fetchChats();
    this.props.requestPushNotification();
  }

  render() {
    return (
      <FlatList
        data={this.props.chats}
        renderItem={({ item }) => (
          <ChatListItem
            navigation={this.props.navigation}
            setCurrentChat={this.props.setCurrentChat}
            item={item}
            userId={this.props.userId}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

const mapState = (state) => ({
  chats: state.chats.chats,
  userId: state.firebase.auth.uid,
});

const mapDispatch = (dispatch) => ({
  fetchUser: () => dispatch(fetchUser()),
  fetchChats: () => dispatch(fetchChats()),
  fetchContacts: () => dispatch(fetchContacts()),
  setCurrentChat: (chatId) => dispatch(setCurrentChat(chatId)),
  requestPushNotification: () => dispatch(registerForPushNotificationsAsync()),
});

export default connect(mapState, mapDispatch)(ChatListScreen);
