import React from 'react'
import {connect} from 'react-redux'
import {FlatList} from 'react-native'

import {ChatListItem} from '../components'
import {
  fetchChats,
  fetchContacts,
  setCurrentChat,
  fetchUser,
  registerForPushNotificationsAsync,
} from '../store'
import {db} from '../Firebase'

class ChatListScreen extends React.Component {
  componentDidMount() {
    this.props.fetchUser()
    this.props.fetchContacts()
    this.props.fetchChats()

    this.focusListener = this.props.navigation.addListener('focus', () => {
      // unsubscribe from firebase listener after initial mount
      db.ref(`users/${this.props.userId}/chatrooms`).off('child_added')
    })

    this.props.requestPushNotification()
  }

  componentWillUnmount() {
    // turn off navigation listener
    this.focusListener()
  }

  render() {
    const chats =
      this.props.route.params.tab === 'groups'
        ? this.props.chats.filter((c) => Object.keys(c.members).length > 1)
        : this.props.chats
    return (
      <FlatList
        data={chats}
        renderItem={({item}) => (
          <ChatListItem
            navigation={this.props.navigation}
            setCurrentChat={this.props.setCurrentChat}
            item={item}
            userId={this.props.userId}
            contacts={this.props.contacts}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }
}

const mapState = (state) => ({
  chats: state.chats.chats,
  userId: state.firebase.auth.uid,
  contacts: state.user.contacts,
})

const mapDispatch = (dispatch) => ({
  fetchUser: () => dispatch(fetchUser()),
  fetchChats: () => dispatch(fetchChats()),
  fetchContacts: () => dispatch(fetchContacts()),
  setCurrentChat: (chatId) => dispatch(setCurrentChat(chatId)),
  requestPushNotification: () => dispatch(registerForPushNotificationsAsync()),
})

export default connect(mapState, mapDispatch)(ChatListScreen)
