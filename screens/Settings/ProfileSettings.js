import * as React from 'react'
import {StyleSheet} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import {putUserName} from '../../store'
import {Button, ListItem} from 'react-native-elements'
import {connect} from 'react-redux'
import {Colors} from '../../constants'

export class ProfileSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
    }
  }

  componentDidMount() {
    const [firstName, lastName] = this.props.name.split(' ')
    this.setState({firstName, lastName})
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ListItem
          title={'First Name'}
          bottomDivider
          titleStyle={styles.title}
          input={{
            value: this.state.firstName,
            onChangeText: (firstName) => this.setState({firstName}),
          }}
          containerStyle={styles.listItem}
        />

        <ListItem
          title={'Last Name'}
          bottomDivider
          titleStyle={styles.title}
          input={{
            value: this.state.lastName,
            onChangeText: (lastName) => this.setState({lastName}),
          }}
          containerStyle={styles.listItem}
        />

        <Button
          title="Save"
          onPress={() => {
            this.props.updateUser(this.state.firstName, this.state.lastName)
            this.props.navigation.navigate('Settings')
          }}
          large
          style={styles.button}
          buttonStyle={styles.buttonBackground}
        />
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
  title: {
    fontWeight: '500',
  },
  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: Colors.medGray,
    borderBottomWidth: 1,
    textAlign: 'left',
  },
  button: {
    paddingTop: 20,
  },
  buttonBackground: {
    backgroundColor: Colors.tintColor,
  },
})

const mapState = (state) => ({
  name: state.user.name,
})

const mapDispatch = (dispatch) => ({
  updateUser: (f, l) => dispatch(putUserName(f, l)),
})

export default connect(mapState, mapDispatch)(ProfileSettings)
