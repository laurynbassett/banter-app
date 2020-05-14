import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import store from './store';
import AppNavigation from './navigation';
import firebase from 'firebase/app';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import useLinking from './navigation/useLinking';

// react-redux-firebase config
const rrfConfig = {
	userProfile: 'users'
};

const rrfProps = {
	firebase,
	config: rrfConfig,
	dispatch: store.dispatch
	// createFirestoreInstance // <- needed if using firestore
};

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
					...Ionicons.font,
					'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
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
				<ReactReduxFirebaseProvider {...rrfProps}>
					<View style={styles.container}>
						{Platform.OS === 'ios' && <StatusBar barStyle='default' />}
						<NavigationContainer ref={containerRef} initialState={initialNavigationState}>
							<AppNavigation />
						</NavigationContainer>
					</View>
				</ReactReduxFirebaseProvider>
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
