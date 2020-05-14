import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChatListItem(props) {
  console.log("rendering chatlistitem", props);
  return (
    <TouchableOpacity onPress={() => props.goToSingleChat(props.item.id)}>
      <View style={styles.itemView}>
        <Text style={styles.chatName}>{props.item.id}</Text>
        <Text style={styles.message}>{props.item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemView: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  chatName: {
    fontWeight: "bold",
  },
  message: {
    color: "#aaa",
  },
});
