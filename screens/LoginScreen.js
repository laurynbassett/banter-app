import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text, Dimensions } from "react-native";
import { auth } from "../Firebase";
import * as Google from "expo-google-app-auth";
import { GOOGLE_IOS_CLIENT_ID } from "react-native-dotenv";
import firebase from "firebase/app";
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
      // isLoggedIn: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
              console.log("user signed in ");
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .set({
                    email: result.user.email,
                    name: `${result.additionalUserInfo.profile.given_name} ${result.additionalUserInfo.profile.family_name}`,
                    created_at: Date.now(),
                  })
                  .then(function (snapshot) {
                    console.log("Snapshot", snapshot);
                  });
              } else {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .update({
                    last_logged_in: Date.now(),
                  });
              }
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.log(errorCode, ": ", errorMessage);
              console.log("email: ", email, "credential: ", credential);
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      }.bind(this)
    );
  };

  loginWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        console.log("LoginScreen.js.js 21 | ", result.user.givenName);
        this.onSignIn(result);
        this.props.navigation.navigate("Root", {
          accessToken: result.accessToken,
        }); //after Google login redirect to HomeScreen
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log("LoginScreen.js.js 30 | Error with login", e);
      return { error: true };
    }
  };

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
});

const mapDispatch = (dispatch) => ({
  loginWithEmail: (email, password) => dispatch(loginWithEP(email, password)),
  loginWithGoogle: () => dispatch(loginWithGoogle()),
});

export default connect(mapState, mapDispatch)(LoginScreen);
