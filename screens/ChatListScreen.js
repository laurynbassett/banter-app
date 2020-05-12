import React from "react";
import { connect } from "react-redux";
import ChatListItem from "../components/ChatListItem";

import {
  // Image,
  // Platform,
  // StyleSheet,
  // Text,
  // TouchableOpacity,
  // View,
  FlatList,
} from "react-native";

const dummyData = [
  {
    title: "Isra",
    lastMessage: "Jacob: yo whats up",
  },
  {
    title: "Group Chat",
    lastMessage: "Jacob: hi whats good",
  },
  {
    title: "Lauryn",
    lastMessage: "Lauryn: Ok sounds great",
  },
];

export function ChatList(props) {
  console.log("PRINTING UID FROM REACT COMPONENT", props.auth.uid);
  return (
    <FlatList
      data={dummyData}
      renderItem={({ item }) => <ChatListItem key={item.title} item={item} />}
    />
  );
}

const mapState = (state) => ({
  user: state.user,
  auth: state.firebase.auth,
});

export default connect(mapState)(ChatList);
