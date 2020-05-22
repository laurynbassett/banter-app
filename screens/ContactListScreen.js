import React, {Component} from 'react'
import {FlatList} from 'react-native'
import {connect} from 'react-redux'

import {ContactListItem} from '../components'

class ContactListScreen extends Component {
  render() {
    return (
      <FlatList
        data={this.props.contacts.sort()}
        renderItem={({item}) => (
          <ContactListItem navigation={this.props.navigation} {...item} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }
}

const mapState = (state) => ({
  contacts: state.user.contacts,
})

export default connect(mapState)(ContactListScreen)
