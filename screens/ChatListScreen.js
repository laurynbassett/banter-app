import React from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";
import { db } from "../Firebase";
import { ChatListItem } from "../components";
import {
  fetchAllChats,
  setCurrentChat,
  fetchUser,
  fetchChatrooms,
} from "../store";
import { registerForPushNotificationsAsync } from "../store/user";

class ChatListScreen extends React.Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.props.fetchUser();
      this.props.fetchChatrooms();
      this.props.fetchAllChats();
      this.props.requestPushNotification();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    db.ref(`users/${this.props.userId}/chatrooms`).off("child_added");
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
  fetchChatrooms: () => dispatch(fetchChatrooms()),
  fetchAllChats: () => dispatch(fetchAllChats()),
  setCurrentChat: (chatId) => dispatch(setCurrentChat(chatId)),
  requestPushNotification: () => dispatch(registerForPushNotificationsAsync()),
});

export default connect(mapState, mapDispatch)(ChatListScreen);
