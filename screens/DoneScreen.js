import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import firebase from "firebase/app";
import { translateText } from "../utils/translate";

class DoneScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      welcome: "Welcome to our application",
    };
  }

  async componentDidMount() {
    const data = await translateText(
      this.state.welcome,
      // this.props.navigation.getParam("language")
      "no"
    );
    const string = data.translations[0].translatedText;

    this.setState({ welcome: string });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.welcome}</Text>
        <Button
          style={styles.button}
          title="Log Out"
          onPress={() => firebase.auth().signOut()}
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
