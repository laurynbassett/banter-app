import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text, Dimensions } from "react-native";
import { auth } from "../Firebase";
import * as Google from "expo-google-app-auth";
import { GOOGLE_IOS_CLIENT_ID } from "react-native-dotenv";
// import firebase from 'firebase/app';
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
// Google Auth Credits: https://github.com/nathvarun/Expo-Google-Login-Firebase/tree/master
// including firebase in import: https://stackoverflow.com/questions/39204923/undefined-is-not-an-object-firebase-auth-facebookauthprovider-credential
import { connect } from "react-redux";
import { loginWithEP, loginWithGoogle } from "../store/auth";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
    };
  }

  handleEmailChange(evt) {
    this.setState({ email: evt.target.value });
  }

  handlePasswordChange(evt) {
    this.setState({ password: evt.target.value });
  }

  render() {
    console.log("GOOGLE_IOS_CLIENT_ID", GOOGLE_IOS_CLIENT_ID);
    console.log("THIS.STATE", this.state);
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

        <TouchableOpacity
          style={styles.button}
          title="Login"
          onPress={() => this.props.loginWithEmail(email, password)}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* TODO: Replace with google button https://stackoverflow.com/questions/46654248/how-to-display-google-sign-in-button-using-html */}
        <TouchableOpacity
          style={styles.button}
          title="Login with Google"
          onPress={() => this.props.loginWithGoogle()}
        >
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          title="Sign Up"
          onPress={() => {
            // this.props.navigation.navigate("LoginScreen", {
            //   screen: "SignUp",
            // });

            this.props.navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const { width: WIDTH } = Dimensions.get("window");

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
    width: WIDTH - 55,
    height: 45,
    backgroundColor: "#0D9BFE",
    borderRadius: 25,
    marginTop: 20,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

const mapState = (state) => ({
  user: state.user,
  auth: state.firebase.auth,
});

const mapDispatch = (dispatch) => ({
  loginWithEmail: (email, password) => dispatch(loginWithEP(email, password)),
  loginWithGoogle: () => dispatch(loginWithGoogle()),
});

export default connect(mapState, mapDispatch)(LoginScreen);
