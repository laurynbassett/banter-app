import React, {Component} from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  Image,
  KeyboardAvoidingView,
} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {connect} from 'react-redux'
import {loginWithEP, loginWithGoogle} from '../store/auth'
import {registerForPushNotificationsAsync} from '../store/user'

// Google Auth Credits: https://github.com/nathvarun/Expo-Google-Login-Firebase/tree/master
// including firebase in import: https://stackoverflow.com/questions/39204923/undefined-is-not-an-object-firebase-auth-facebookauthprovider-credential

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loading: false,
      expoPushToken: '',
      notification: {},
    }
  }

  // handleEmailChange(evt) {
  //   this.setState({ email: evt.target.value });
  // }

  // handlePasswordChange(evt) {
  //   this.setState({ password: evt.target.value });
  // }

  render() {
    const {email, password} = this.state
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.image}>
          <Image
            source={require('../assets/images/login_logo.png')}
            resizeMode="center"
          />
        </View>
        <TextInput
          style={styles.inputBox}
          type="email"
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          style={styles.inputBox}
          type="password"
          value={password}
          autoCapitalize="none"
          onChangeText={(password) => this.setState({password})}
          placeholder="Password"
        />

        <TouchableOpacity
          style={styles.button}
          title="Login"
          onPress={() => {
            this.props.loginWithEmail(email, password)
            // this.props.requestPushNotification();
          }}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* TODO: Replace with google button https://stackoverflow.com/questions/46654248/how-to-display-google-sign-in-button-using-html */}
        {/* <TouchableOpacity
          style={styles.button}
          title="Login with Google"
          onPress={() => {
            this.props.loginWithGoogle()
            // this.props.requestPushNotification();
          }}
        >
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.GooglePlusStyle}
          activeOpacity={0.5}
          onPress={() => {
            this.props.loginWithGoogle()
            // this.props.requestPushNotification();
          }}
        >
          <Image
            source={require('../assets/images/google_button.png')}
            style={styles.GoogleImageIconStyle}
          />
          <Text style={styles.GoogleTextStyle}> Sign In with Google </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          title="Sign Up"
          onPress={() => {
            this.props.navigation.navigate('SignUp')
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const {width: WIDTH} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c8cfc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    textAlign: 'left',
    backgroundColor: 'white',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#3c8cfc',
    height: 50,
    width: 220,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#3c8cfc',
    fontSize: 16,
    textAlign: 'center',
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#3c8cfc',
    height: 50,
    width: 220,
    borderRadius: 5,
    marginTop: 20,
  },
  GoogleImageIconStyle: {
    height: 58,
    width: 50,
    resizeMode: 'cover',
  },
  GoogleTextStyle: {
    marginBottom: 4,
    marginRight: 20,
    fontSize: 16,
    color: '#3c8cfc',
    paddingLeft: 8,
  },
})

const mapState = (state) => ({
  user: state.user,
  auth: state.firebase.auth,
})

const mapDispatch = (dispatch) => ({
  loginWithEmail: (email, password) => dispatch(loginWithEP(email, password)),
  loginWithGoogle: () => dispatch(loginWithGoogle()),
  requestPushNotification: () => dispatch(registerForPushNotificationsAsync()),
})

export default connect(mapState, mapDispatch)(LoginScreen)
