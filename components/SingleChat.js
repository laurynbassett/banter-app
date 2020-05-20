import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {GiftedChat, MessageText} from 'react-native-gifted-chat'
import {connect} from 'react-redux'
import {db} from '../Firebase'
import {fetchMessages, postMessage} from '../store'

class SingleChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentChatId: this.props.currentChat.id,
      originalsShown: {},
    }
    this.handleSendMessage = this.handleSendMessage.bind(this)
  }

  static navigationOptions = ({navigation}) => ({
    tabBarVisible: false,
  })

  componentDidMount() {
    // fetch all messages for the current chat (fetchMessages will use the currentChatId in chats reducer to make query)
    this.focusUnsubscribe = this.props.navigation.addListener('focus', () => {
      // fetch messages for current chat when in focus
      this.props.fetchMessages()
    })

    this.blurUnsubscribe = this.props.navigation.addListener('blur', () => {
      // unsubscribe from firebase listener when chat is not in focus
      db.ref(`messages/${this.state.currentChatId}`).off('child_added')
    })
  }

  componentWillUnmount() {
    // turn off navigation listeners
    this.focusUnsubscribe()
    this.blurUnsubscribe()
  }

  handleSendMessage(messages) {
    const {currentChat, displayName, postMessage, route, uid} = this.props

    // console.log("ROUTE", Object.keys(this.props.currentChat.members));
    // {contact1: test khan, contact2: jane doe}
    // Change to an object or an array of contactIds
    const contactId =
      route.params.contactId || Object.keys(this.props.currentChat.members)

    // Change to object or an array of contact Names --- may need to combine
    // id and name into 1
    const contactName = route.params.name
    const message = messages[messages.length - 1].text
    const timestamp = Date.now()
    const currChatId = currentChat ? currentChat.id : ''
    postMessage({
      uid,
      displayName,
      contactId,
      contactName,
      currChatId,
      message,
      timestamp,
    })
  }

  render() {
    // console.log(this.state);

    return (
      <View style={styles.container}>
        <Text style={{color: 'red'}}>{this.props.sendMessageError}</Text>
        <GiftedChat
          messages={this.props.messages}
          user={{
            _id: this.props.uid,
            name: this.props.displayName,
          }}
          onSend={this.handleSendMessage}
          alignTop={true}
          isTyping={true}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          placeholder="Type a message..."
          inverted={false}
          renderMessageText={(params) => {
            return (
              <View>
                {this.state.originalsShown[params.currentMessage._id] && (
                  <Text style={styles.originalMessage}>
                    {params.currentMessage.original}
                  </Text>
                )}
                {this.props.uid !== params.currentMessage.user._id && (
                  <>
                    {params.currentMessage.translatedFrom !== false && (
                      <TouchableOpacity>
                        <Text
                          style={styles.showButton}
                          onPress={() => {
                            if (
                              this.state.originalsShown[
                                params.currentMessage._id
                              ]
                            ) {
                              this.setState((prevState) => {
                                return {
                                  originalsShown: {
                                    ...prevState.originalsShown,
                                    ...{
                                      [params.currentMessage._id]: !this.state
                                        .originalsShown[
                                        params.currentMessage._id
                                      ],
                                    },
                                  },
                                }
                              })
                            } else {
                              this.setState((prevState) => {
                                return {
                                  originalsShown: {
                                    ...prevState.originalsShown,
                                    ...{[params.currentMessage._id]: true},
                                  },
                                }
                              })
                            }
                          }}
                        >
                          {this.state.originalsShown[params.currentMessage._id]
                            ? 'Hide Original'
                            : 'Show Original'}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.messageBox}>
                      {params.currentMessage.translatedFrom !== false
                        ? `Translated From: ${params.currentMessage.translatedFrom}`
                        : 'Not Translated'}
                    </Text>
                  </>
                )}
                <MessageText {...params} />
              </View>
            )
          }}
        />
      </View>
    )
  }
}

const mapState = (state) => ({
  messages: state.messages.messages,
  uid: state.firebase.auth.uid,
  displayName: state.user.name,
  currentChat: state.chats.currentChat,
  sendMessageError: state.messages.sendMessageError,
})

const mapDispatch = (dispatch) => ({
  fetchMessages: () => dispatch(fetchMessages()),
  postMessage: (msg) => dispatch(postMessage(msg)),
})

export default connect(mapState, mapDispatch)(SingleChat)

const styles = StyleSheet.create({
  messageBox: {
    color: 'grey',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  originalMessage: {
    color: 'black',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1,
  },
  showButton: {
    color: 'rgb(102, 153, 255)',
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    // width: Layout.window.width,
    // height: Layout.window.height * 0.85,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
})
