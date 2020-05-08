import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { auth } from "../Firebase";

class DoneScreen extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  async logout() {
    try {
      const loggedOut = await auth.signOut();
      if (loggedOut) {
        console.log("user logged out");
        this.setState({ loading: false });
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Done Screen</Text>
        <Button
          style={styles.button}
          title="Log Out"
          onPress={() => this.logout()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    textAlign: "left",
  },
  button: {
    borderColor: "blue",
  },
});

export default DoneScreen;
