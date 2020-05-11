import React from "react";

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

export default function ChatListItem(props) {
  return (
    <TouchableOpacity onPress={() => props.goToSingleChat()}>
      <View style={styles.itemView}>
        <Text style={styles.chatName}>{props.item.title}</Text>
        <Text style={styles.message}>{props.item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemView: {
    padding: 15,
  },
  chatName: {
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  message: {
    color: "#aaa",
  },
});
