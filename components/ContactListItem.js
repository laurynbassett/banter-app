import React from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'

import {fetchCurrentChatId} from '../store'
import {ContactListAvatar} from '../utils'
import {Colors} from '../constants'

const ContactListItem = (props) => {
  const goToSingleChat = async () => {
    // set current chatroom in redux
    await props.fetchCurrentChatId(
      // {contactId: props.id, name: props.name},
      {uid: props.uid, userName: props.userName},
      props.navigation,
      [{contactId: props.id, contactName: props.name}]
    )
  }
  return (
    <TouchableHighlight onPress={goToSingleChat}>
      <View style={styles.container}>
        <ContactListAvatar imageUrl={props.imageUrl} name={props.name} />
        <View style={styles.contactWrapper}>
          <View style={styles.contactNameWrapper}>
            <Text style={styles.contactName}>{props.name}</Text>
          </View>
          <View style={styles.contactInfoWrapper}>
            <Text style={styles.contactWrapper}>{props.email}</Text>
          </View>
          {props.phone ? (
            <View style={styles.contactInfoWrapper}>
              <Text style={styles.contactWrapper}>{props.phone}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableHighlight>
  )
}

const mapState = (state) => ({
  uid: state.firebase.auth.uid,
  userName: state.firebase.auth.displayName,
})

const mapDispatch = (dispatch) => ({
  fetchCurrentChatId: (user, navigation, contacts) =>
    dispatch(fetchCurrentChatId(user, navigation, contacts)),
})

export default connect(mapState, mapDispatch)(ContactListItem)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.medGray,
    backgroundColor: '#fff',
  },
  contactWrapper: {
    marginLeft: 10,
  },
  contactNameWrapper: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfoWrapper: {
    marginTop: 5,
  },
  contactInfo: {
    fontSize: 13,
  },
})
