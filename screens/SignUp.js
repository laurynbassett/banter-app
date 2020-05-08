import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { auth } from "../Firebase";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  async signup(email, password) {
    try {
      this.setState({ loading: true });
      const user = await auth.createUserWithEmailAndPassword(email, password);
      if (user) {
        console.log("user", user);
        await auth.signInWithEmailAndPassword(email, password);
        this.props.navigation.navigate("Home");
        this.setState({ loading: false });
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  handleEmailChange(evt) {
    this.setState({ email: evt.target.value });
  }

  handlePasswordChange(evt) {
    this.setState({ password: evt.target.value });
  }

  render() {
    const { email, password } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          type="email"
          value={email}
          placeholder="Email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={styles.inputBox}
          type="password"
          value={password}
          placeholder="Password"
          onChangeText={(password) => this.setState({ password })}
        />
        <TouchableOpacity onPress={() => this.signup(email, password)}>
          <Text>Signup</Text>
        </TouchableOpacity>
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

export default Signup;
