import * as React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";
import firebase from "firebase/app";

export default function ProfileSettings() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Avatar
        size="large"
        title="LW"
        onPress={() => console.log("Works!")}
        activeOpacity={0.7}
      />

      <TextInput
        style={styles.inputBox}
        type="firstName"
        // value={email}
        placeholder="First Name"
        onChangeText={(firstName) => this.setState({ firstName })}
      />

      <TextInput
        style={styles.inputBox}
        type="lastName"
        // value={email}
        placeholder="Last Name"
        onChangeText={(lastName) => this.setState({ lastName })}
      />

      <TextInput
        style={styles.inputBox}
        type="language"
        // value={email}
        placeholder="Language"
        onChangeText={(language) => this.setState({ language })}
      />

      <Button
        style={styles.button}
        title="Log Out"
        onPress={() => {
          firebase.auth().signOut();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "left",
  },
});
