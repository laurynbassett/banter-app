import React, {Component} from 'react'
import {StyleSheet, Text, Button, SectionList, View} from 'react-native'
import {ListItem} from 'react-native-elements'
import {connect} from 'react-redux'
import {createSectionedData, findIndices} from '../../utils'
import {fetchCurrentChatId} from '../../store/chats'

export class NewGroupChat extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
    }
    this.checkItem = this.checkItem.bind(this)
    this.getSelected = this.getSelected.bind(this)
    this.createGroup = this.createGroup.bind(this)
  }

  componentDidMount() {
    // Transforming contacts data into correct format for SectionList
    const data = createSectionedData(this.props.contacts)
    this.setState({data})

    // Overriding header buttons
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button title="Create Group" onPress={() => this.createGroup()} />
      ),
      headerLeft: () => (
        <Button
          title="Cancel"
          onPress={() => this.props.navigation.navigate('Chat')}
        />
      ),
    })
  }

  // Return current state of checkbox
  checkItem(itemName, itemId) {
    const {sectionIndex, nameIndex} = findIndices(
      itemName,
      itemId,
      this.state.data
    )

    return this.state.data[sectionIndex].data[nameIndex].checked
  }

  // Handling selection of checkbox
  handlePress(itemName, itemId) {
    const data = this.state.data
    const {sectionIndex, nameIndex} = findIndices(itemName, itemId, data)

    data[sectionIndex].data[nameIndex].checked = !data[sectionIndex].data[
      nameIndex
    ].checked

    this.setState({data})
  }

  // Getting all selecte checkboxes
  getSelected() {
    let selected = []

    this.state.data.forEach((section) => {
      section.data.forEach((contact) => {
        if (contact.checked === true) {
          selected.push({contactId: contact.id, contactName: contact.name})
        }
      })
    })

    return selected
  }

  async createGroup() {
    const selected = this.getSelected(this.state.data)

    // set current chatroom in redux
    await this.props.fetchCurrentChatId(
      {uid: this.props.uid, userName: this.props.userName},
      this.props.navigation,
      selected
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.data}
          renderItem={({item}) => (
            <ListItem
              title={item.name}
              bottomDivider
              checkBox={{
                onIconPress: () => this.handlePress(item.name, item.id),
                checked: this.checkItem(item.name, item.id),
              }}
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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
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

export default connect(mapState, mapDispatch)(NewGroupChat)
