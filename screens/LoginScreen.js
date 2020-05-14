import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  Vibration,
  Platform,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { GOOGLE_IOS_CLIENT_ID } from "react-native-dotenv";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { loginWithEP, loginWithGoogle } from "../store/auth";

// Google Auth Credits: https://github.com/nathvarun/Expo-Google-Login-Firebase/tree/master
// including firebase in import: https://stackoverflow.com/questions/39204923/undefined-is-not-an-object-firebase-auth-facebookauthprovider-credential

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      expoPushToken: "",
      notification: {},
    };
    this.registerForPushNotificationsAsync = this.registerForPushNotificationsAsync.bind(
      this
    );
    this._handleNotification = this._handleNotification.bind(this);
  }

  // handleEmailChange(evt) {
  //   this.setState({ email: evt.target.value });
  // }

  // handlePasswordChange(evt) {
  //   this.setState({ password: evt.target.value });
  // }

  registerForPushNotificationsAsync = async () => {
    // isDevice checks that user is not on a simulator, but actually on a real device

    if (Constants.isDevice) {
      // status returns either "undetermined", "granted", or "denied"
      // "undetermined" means the user has not either granted or denied when prompted
      // "granted" means the user answered yes to turning on push notifications
      // "denied" means the user rejected push notifications
      // source: https://docs.expo.io/versions/latest/sdk/permissions/#returns

      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      //TODO: update so we're only asking Permission if status = "undetermined".
      // Don't want to ask the user every time they login (?)
      if (existingStatus !== "granted") {
        //This command initiates notification popup
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );

        //IF permission is granted, finalStatus will === "granted"
        //TODO: if finalStatus !== existingStatus --> update users/uid/notifications/status
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        // alert("Failed to get push token for push notification!");
        return;
      }

      // TODO: Store token in users/uid/notifications/token
      let token = await Notifications.getExpoPushTokenAsync();

      // TODO: Persist token to store
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }
  };

  _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

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

        <TouchableOpacity
          style={styles.button}
          title="Login"
          onPress={() => {
            this.props.loginWithEmail(email, password);
            this.registerForPushNotificationsAsync();
          }}
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
