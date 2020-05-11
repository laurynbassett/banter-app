import React from "react";

import ChatListItem from "../components/ChatListItem";

import { db } from "../Firebase";

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

// db.ref("users/" + userId).set({
//   username: name,
//   email: email,
//   profile_picture: imageUrl,
// });

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

export default function ChatList() {
  return (
    <FlatList
      data={dummyData}
      renderItem={({ item }) => <ChatListItem key={item.title} item={item} />}
    />
  );
}
