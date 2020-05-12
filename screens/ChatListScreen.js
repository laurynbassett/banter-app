import React from 'react';
import { connect } from 'react-redux';

import firebase, { auth } from '../Firebase';
import { fetchChatrooms } from '../store/user';
import { ChatListItem } from '../components';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { GoogleAuthData } from 'expo-google-sign-in';
import { setCurrentChat } from '../store/chats';

const dummyData = [
	{
		id: '5',
		title: 'Isra',
		lastMessage: 'Jacob: yo whats up'
	},
	{
		id: '4',
		title: 'Group Chat',
		lastMessage: 'Jacob: hello'
	},
	{
		id: '3',
		title: 'Lauryn',
		lastMessage: 'Lauryn: Ok sounds great'
	}
];

class ChatListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.goToSingleChat = this.goToSingleChat.bind(this);
	}

	fetchChatData = async () => {
		const uid = auth.currentUser.uid;
		await this.props.fetchChatrooms();
		console.log('FETCHED CHATROOMS/CHATS');
	};

	componentDidMount() {
		this.fetchChatData();
	}

	goToSingleChat(item) {
		// set current chat
		this.props.setCurrentChat();
		console.log('yes', this.props);
		this.props.navigation.navigate('SingleChat');
	}

	render() {
		return (
			<FlatList
				data={dummyData}
				renderItem={({ item }) => (
					<ChatListItem item={item} goToSingleChat={item => this.goToSingleChat(item)} />
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}
}

const mapDispatch = dispatch => ({
	setCurrentChat: () => dispatch(setCurrentChat()),
	fetchChatrooms: () => dispatch(fetchChatrooms())
});

export default connect(null, mapDispatch)(ChatListScreen);

// export default function ChatListScreen({ navigation }) {
//   console.log("CHAT LIST PROPS", navigation);

//   function goToSingleChat() {
//     console.log("yes");
//     navigation.navigate("SingleChat", {
//       contactId: "Xr067E9MvdVlMPB3k2fXO7EfFgZ2",
//       contactName: "Isra Khan",
//       contactEmail: "israkhan2@gmail.com",
//     });
//   }

//   return (
//     <View>
//       <FlatList
//         data={dummyData}
//         renderItem={({ item }) => (
//           <ChatListItem
//             key={item.title}
//             item={item}
//             goToSingleChat={goToSingleChat}
//           />
//         )}
//       />
//     </View>
//   );
// }
