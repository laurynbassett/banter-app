import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import { auth } from "../Firebase";
import {
  SingleChatHeaderLeft,
  SingleChatHeaderCenter,
} from "./SingleChatHeader";

const dummyUserGrace = {
  name: "Grace Hopper",
  language: "english",
  username: "ghopper",
  email: "ghopper@gmail.com",
  photoURL:
    "https://gravatar.com/avatar/6b48cda542ae00a2eac4268528733ae8?s=200&d=mp&r=x",
  _id: "1",
};

const dummyUserAda = {
  name: "Ada Lovelace",
  language: "english",
  username: "alovelace",
  email: "alovelace@gmail.com",
  photoURL:
    "https://gravatar.com/avatar/6b48cda542ae00a2eac4268528733ae8?s=200&d=mp&r=x",
  _id: "2",
};

const dummyMessages = [
  {
    text: "Hey",
    sender: "ghopper",
    timestamp: 1459361875337,
    user: dummyUserGrace,
  },
  {
    text: "Hi",
    sender: "alovelace",
    timestamp: 1459361875666,
    user: dummyUserAda,
  },
  {
    text: "How are you?",
    sender: "ghopper",
    timestamp: 1459361875777,
    user: dummyUserGrace,
  },
  {
    text: "I am well. How are you?",
    sender: "alovelace",
    timestamp: 1459361875888,
    user: dummyUserAda,
  },
  {
    text: "Great, thanks.",
    sender: "ghopper",
    timestamp: 1459361875999,
    user: dummyUserGrace,
  },
];

export default class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      messages: [],
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerStyle: styles.headerContainer,
    title: SingleChatHeaderCenter,
    headerLeft: SingleChatHeaderLeft,
  });

  componentDidMount() {
    // const user = auth.currentUser;
    // if (user != null) {
    // 	this.setState({ user });
    // }
    // Fire.shared.on(message =>
    //   this.setState(previousState => ({
    //     messages: GiftedChat.append(previousState.messages, message),
    //   }))
    // );
    this.setState({ user: dummyUserGrace, messages: dummyMessages });
  }

  // componentWillUnmount() {
  //   Fire.shared.off()
  // }

  // get user() {
  //   return {
  //     name: this.props.navigation.state.params.name,
  //     _id: Fire.shared.uid,
  //   };
  // }

  render() {
    console.log("MESSAGES", this.state.messages);
    if (this.state.messages.length) {
      return (
        <View
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <GiftedChat
            messages={this.state.messages}
            user={this.state.user}
            alignTop={true}
          />
          {/* <GiftedChat messages={this.state.messages} user={this.user} onSend={Fire.shared.send} alignTop={true} /> */}
        </View>
      );
    } else return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    marginTop: 10,
  },
  contentContainer: {
    paddingTop: 15,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fafafa",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
