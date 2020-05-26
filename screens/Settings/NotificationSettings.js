import * as React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import {ListItem} from 'react-native-elements'

import {Colors} from '../../constants'

// let languageArr = Object.keys(languages)
//   .map(function (key) {
//     return languages[key];
//   })
//   .filter((l) => l !== "Auto Detect");

export default class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sound: 'Note',
      pushNotify: true,
      preview: true,
    }
  }

  render() {
    return (
      <ScrollView>
        <View>
          <Text style={styles.label}>Push Notifications</Text>
          <ListItem
            title={'Show Notifications'}
            bottomDivider
            switch={{
              value: this.state.pushNotify,
              onValueChange: (value) => {
                this.setState({pushNotify: value})
              },
            }}
            containerStyle={styles.listItem}
          />
          <ListItem
            title={'Sound'}
            bottomDivider
            rightSubtitle={this.state.sound}
            chevron
            containerStyle={styles.listItem}
          />
        </View>
        <View>
          <ListItem
            title={'Show Preview'}
            style={styles.topRow}
            bottomDivider
            switch={{
              value: this.state.preview,
              onValueChange: (value) => {
                this.setState({preview: value})
              },
            }}
            containerStyle={styles.listItem}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: Colors.medGray,
    backgroundColor: '#fff',
  },
  label: {
    paddingTop: 13,
    paddingBottom: 8,
    paddingLeft: 8,
    color: 'grey',
  },
  topRow: {
    paddingTop: 26,
  },
})
