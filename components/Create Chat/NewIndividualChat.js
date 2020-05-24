import React, {Component} from 'react'
import {StyleSheet, Text, Button, SectionList, View} from 'react-native'
import {ListItem} from 'react-native-elements'
import {Entypo} from '@expo/vector-icons'
import {connect} from 'react-redux'
import {createSectionedData} from '../../utils'
import {fetchCurrentChatId} from '../../store/chats'
import {Colors} from '../../constants'

export class NewIndividualChat extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
    }
    this.handleContactSelection = this.handleContactSelection.bind(this)
  }

  componentDidMount() {
    // Transforming contacts data into correct format for SectionList
    const data = createSectionedData(this.props.contacts)
    this.setState({data})

    // Overriding header buttons
    this.props.navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <Button
          title="Cancel"
          onPress={() => this.props.navigation.navigate('Chat')}
        />
      ),
    })
  }

  async handleContactSelection(contactId, contactName) {
    // set current chatroom in redux
    await this.props.fetchCurrentChatId(
      {uid: this.props.uid, userName: this.props.userName},
      this.props.navigation,
      [{contactId, contactName}]
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ListItem
          title={'New Group'}
          titleStyle={{color: Colors.tintColor}}
          leftIcon={() => <Entypo name="users" size={20} style={styles.icon} />}
          bottomDivider
          onPress={() => this.props.navigation.navigate('NewGroupChat')}
          containerStyle={styles.listItem}
        />
        <ListItem
          title={'New Contact'}
          titleStyle={{color: Colors.tintColor}}
          leftIcon={() => (
            <Entypo name="add-user" size={20} style={styles.icon} />
          )}
          bottomDivider
          onPress={() => console.log('pressed')}
          containerStyle={styles.listItem}
        />

        <SectionList
          sections={this.state.data}
          renderItem={({item}) => (
            <ListItem
              title={item.name}
              bottomDivider
              onPress={() => this.handleContactSelection(item.id, item.name)}
              containerStyle={styles.listItem}
            />
          )}
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
          stickySectionHeadersEnabled
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  icon: {
    color: Colors.tintColor,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: Colors.medGray,
    backgroundColor: '#fff',
  },
})

const mapState = (state) => ({
  contacts: state.user.contacts,
  uid: state.firebase.auth.uid,
  userName: state.firebase.auth.displayName,
})

const mapDispatch = (dispatch) => ({
  fetchCurrentChatId: (user, navigation, contacts) =>
    dispatch(fetchCurrentChatId(user, navigation, contacts)),
})

export default connect(mapState, mapDispatch)(NewIndividualChat)
