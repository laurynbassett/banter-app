import UserAvatar from 'react-native-user-avatar';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AvatarIcon(props) {
	return <UserAvatar name={props.name} size={32} style={styles.avatar} bgColor='#A9A9A9' />;
}

const styles = StyleSheet.create({
	avatar: {
		marginBottom: -3,
		borderRadius: 100,
		width: 50,
		height: 50
	}
});
