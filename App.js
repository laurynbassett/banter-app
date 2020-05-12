import React, { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";

import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./store";
import useLinking from "./navigation/useLinking";
import AppNavigation from "./navigation";
import firebase from "firebase/app";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

<<<<<<< HEAD
import { BottomTabNavigator, useLinking } from "./navigation";
import {
  ChatList as ChatListScreen,
  HomeScreen,
  LoadingScreen,
  LoginScreen,
  SingleChatScreen,
  SignUpScreen,
} from "./screens";
import store from "./store";

import { SingleChatHeaderLeft, SingleChatHeaderCenter } from "./components";
=======
// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
};
>>>>>>> 41a64d4fc33d5e07f4fd5b61ffc3c5ab8e29e904

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  // createFirestoreInstance // <- needed if using firestore
};

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();
  const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        SplashScreen.preventAutoHide();

        // Load fonts
        await Font.loadAsync({
<<<<<<< HEAD
=======
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }

      // Load fonts
      try {
        await Expo.Font.loadAsync({
          ...Ionicons.font,
>>>>>>> 41a64d4fc33d5e07f4fd5b61ffc3c5ab8e29e904
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    };

    loadResourcesAndDataAsync();
  }, []);
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <Provider store={store}>
<<<<<<< HEAD
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <NavigationContainer
            ref={containerRef}
            initialState={initialNavigationState}
          >
            <Stack.Navigator>
              <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="Root" component={BottomTabNavigator} />
              <Stack.Screen name="ChatList" component={ChatListScreen} />
              <Stack.Screen
                name="SingleChat"
                component={SingleChatScreen}
                options={{
                  // headerStyle: styles.headerContainer,
                  headerTitle: SingleChatHeaderCenter,
                  // headerLeft: SingleChatHeaderLeft,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
=======
        <ReactReduxFirebaseProvider {...rrfProps}>
          <View style={styles.container}>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <NavigationContainer
              ref={containerRef}
              initialState={initialNavigationState}
            >
              <AppNavigation />
            </NavigationContainer>
          </View>
        </ReactReduxFirebaseProvider>
>>>>>>> 41a64d4fc33d5e07f4fd5b61ffc3c5ab8e29e904
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
