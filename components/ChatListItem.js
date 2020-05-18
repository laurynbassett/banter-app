import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { auth } from "../Firebase";
import AvatarIcon from "./AvatarIcon";
import { memberHelper } from "../utils";

export default function ChatListItem(props) {
  console.log("rendering chatlistitem", props);
  let members = props.item.members;
  delete members[props.userId];

  members = memberHelper(Object.values(members));
  const avatarName = members[0];

  const goToSingleChat = (chatId) => {
    // set current chatroom in redux
    props.setCurrentChat(chatId);
    // navigate to single chat page
    props.navigation.navigate("SingleChat", {
      contactId: props.id,
      name: props.name,
    });
  };
  console.log("MEMBERS", members);

  return (
    <TouchableOpacity onPress={() => goToSingleChat(props.item.id)}>
      <View style={styles.itemView}>
        {props.imageUrl ? (
          <Image source={{ uri: props.imageUrl }} style={styles.image} />
        ) : (
          <AvatarIcon style={styles.image} name={avatarName} />
        )}
        <View style={styles.detailsWrapper}>
          <View style={styles.chatNameWrapper}>
            <Text style={styles.chatName}>
              {members.length > 1
                ? `${members[0]} & ${members.length - 1} others`
                : members}
            </Text>
          </View>
          <View style={styles.messageWrapper}>
            <Text style={styles.message}>{props.item.lastMessage}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemView: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#b7b7b7",
    backgroundColor: "#fff",
  },
  chatName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    fontSize: 17,
    color: "#aaa",
  },
  image: {
    width: 20,
    height: 80,
  },
  detailsWrapper: {
    marginLeft: 10,
  },
  chatNameWrapper: {
    marginLeft: 10,
  },
  messageWrapper: {
    marginTop: 5,
    marginLeft: 10,
  },
});
