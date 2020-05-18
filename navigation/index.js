import React from 'react';
import LoginNavigator from './LoginNavigator';
import { connect } from 'react-redux';
import { default as BottomTabNavigator } from './BottomTabNavigator';

export function AppNavigation(props) {
	const isLoggedIn = props.auth.uid;
	return !isLoggedIn ? <LoginNavigator /> : <BottomTabNavigator />;
}

const mapState = state => ({
	auth: state.firebase.auth
});

export default connect(mapState)(AppNavigation);
