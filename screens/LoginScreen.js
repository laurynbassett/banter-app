import React from "react";
import { View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { GOOGLE_IOS_CLIENT_ID } from "react-native-dotenv";
import * as Google from "expo-google-app-auth";
import auth from "./../Firebase";

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.signInWithGoogleAsync = this.signInWithGoogleAsync.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  isUserEqual = async (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId === auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = async (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = auth.onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        auth
          .signInWithCredential(credential)
          .then(function () {
            console.log("user signed in");
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Button
          style={styles.button}
          title="Login"
          onPress={() => Alert.alert("Button with adjusted color pressed")}
        />
        <Button
          style={styles.button}
          title="Sign in with Google"
          onPress={() => this.signInWithGoogleAsync()}
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

export default LoginScreen;
