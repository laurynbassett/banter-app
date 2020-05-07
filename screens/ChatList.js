import React from "react";

import ChatListItem from "./ChatListItem";

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

export default function ChatList() {
  return (
    <FlatList
      data={dummyData}
      renderItem={({ item }) => <ChatListItem key={item.title} item={item} />}
    />
  );
}
