import * as React from "react";
import { StyleSheet, Button, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";
import firebase from "firebase/app";
import { putUserName } from "../../store/user";
import { connect } from "react-redux";

export class ProfileSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
    };
  }

  componentDidMount() {
    const [firstName, lastName] = this.props.name.split(" ");
    this.setState({ firstName, lastName });
  }

  handleFirstNameChange(evt) {
    this.setState({ firstName: evt.target.value });
  }

  handleLastNameChange(evt) {
    this.setState({ lastName: evt.target.value });
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TextInput
          style={styles.inputBox}
          type="firstName"
          value={this.state.firstName}
          placeholder="First Name"
          onChangeText={(firstName) => this.setState({ firstName })}
        />

        <TextInput
          style={styles.inputBox}
          type="lastName"
          value={this.state.lastName}
          placeholder="Last Name"
          onChangeText={(lastName) => this.setState({ lastName })}
        />

        <Button
          style={styles.button}
          title="Save"
          onPress={() => {
            this.props.updateUser(this.state.firstName, this.state.lastName);
            this.props.navigation.navigate("Settings");
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "left",
  },
});

const mapState = (state) => ({
  name: state.user.name,
});

const mapDispatch = (dispatch) => ({
  updateUser: (f, l) => dispatch(putUserName(f, l)),
});

export default connect(mapState, mapDispatch)(ProfileSettings);
