import React, {Component} from 'react'
import {SectionList, StyleSheet, Text} from 'react-native'
import {connect} from 'react-redux'

import {ContactListItem} from '../components'
import {createSectionedData, findIndices} from '../utils'
class ContactListScreen extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
    }
    this.checkItem = this.checkItem.bind(this)
  }

  componentDidMount() {
    // Transforming contacts data into correct format for SectionList
    const data = createSectionedData(this.props.contacts)
    this.setState({data})
  }

  checkItem(itemName, itemId) {
    const {sectionIndex, nameIndex} = findIndices(
      itemName,
      itemId,
      this.state.data
    )

    return this.state.data[sectionIndex].data[nameIndex].checked
  }

  render() {
    return (
      <SectionList
        sections={this.state.data}
        renderItem={({item}) => (
          <ContactListItem navigation={this.props.navigation} {...item} />
        )}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        stickySectionHeadersEnabled
      />
    )
  }
}

const styles = StyleSheet.create({
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
  contacts: state.user.contacts.sort((a, b) => (a.name > b.name ? 1 : -1)),
})

export default connect(mapState)(ContactListScreen)
