import React, { Component } from "react";
import { StyleSheet, TextInput, View, Button } from "react-native";

// import {
//   login as userLogin,
//   logout as userLogout,
//   checkLogin,
// } from "../FireAuth";
import { auth } from "../Firebase";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      // isLoggedIn: false,
    };
    this.login = this.login.bind(this);
    // this.logout = this.logout.bind(this);
    // this.isLoggedIn = this.isLoggedIn.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  async login(email, password) {
    try {
      this.setState({ loading: true });
      const user = await auth.signInWithEmailAndPassword(email, password);
      if (user) {
        console.log("user", user);
        this.props.navigation.navigate("Home");
        this.setState({ loading: false });
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  // logout() {
  //   try {
  //     this.setState({ loading: true });
  //     const loggedOut = userLogout();
  //     if (loggedOut) {
  //       console.log("user logged out");
  //       this.setState({ loading: false });
  //     }
  //   } catch (err) {
  //     console.log("Error", err);
  //   }
  // }

  // isLoggedIn() {
  //   try {
  //     this.setState({ loading: true });
  //     const loggedIn = checkLogin();
  //     if (loggedIn) {
  //       console.log("logged in");
  //       this.setState({ loading: false, isLoggedIn: true });
  //     } else {
  //       console.log("logged out");
  //       this.setState({ loading: false, isLoggedIn: false });
  //     }
  //   } catch (err) {
  //     console.log("Error", err);
  //   }
  // }

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
          onChangeText={(password) => this.setState({ password })}
          placeholder="Password"
        />

        <Button
          style={styles.button}
          title="Login"
          onPress={() => this.login(email, password)}
        />

        <Button
          style={styles.button}
          title="Sign Up"
          onPress={() => this.props.navigation.navigate("SignUp")}
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

export default Login;
