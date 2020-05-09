import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';

import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator, useLinking } from './navigation';
import {
	ChatList as ChatListScreen,
	HomeScreen,
	LoadingScreen,
	LoginScreen,
	SingleChatScreen,
	SignUpScreen
} from './screens';
import store from './store';

const Stack = createStackNavigator();

export default function App(props) {
	const [ isLoadingComplete, setLoadingComplete ] = useState(false);
	const [ initialNavigationState, setInitialNavigationState ] = useState();
	const containerRef = useRef();
	const { getInitialState } = useLinking(containerRef);

	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		const loadResourcesAndDataAsync = async () => {
			try {
				SplashScreen.preventAutoHide();

				// Load fonts
				await Font.loadAsync({
					'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
					...Ionicons.font
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
	console.log('STORE', store);
	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return null;
	} else {
		return (
			<Provider store={store}>
				<View style={styles.container}>
					{Platform.OS === 'ios' && <StatusBar barStyle='default' />}
					<NavigationContainer ref={containerRef} initialState={initialNavigationState}>
						<Stack.Navigator>
							<Stack.Screen name='LoadingScreen' component={LoadingScreen} />
							<Stack.Screen name='LoginScreen' component={LoginScreen} />
							<Stack.Screen name='SignUpScreen' component={SignUpScreen} />
							<Stack.Screen name='Root' component={BottomTabNavigator} />
							<Stack.Screen name='ChatList' component={ChatListScreen} />
							<Stack.Screen name='SingleChat' component={SingleChatScreen} />
						</Stack.Navigator>
					</NavigationContainer>
				</View>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// })
