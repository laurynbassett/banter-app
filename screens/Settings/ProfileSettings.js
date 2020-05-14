import * as React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { putUserName } from "../../store/user";
import { Button, ListItem } from "react-native-elements";
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
        <ListItem
          title={"First Name"}
          bottomDivider
          titleStyle={styles.title}
          input={{
            value: this.state.firstName,
            onChangeText: (firstName) => this.setState({ firstName }),
          }}
        />

        <ListItem
          title={"Last Name"}
          bottomDivider
          titleStyle={styles.title}
          input={{
            value: this.state.lastName,
            onChangeText: (lastName) => this.setState({ lastName }),
          }}
        />

        {/* <Button
          style={styles.button}
          title="Save"
          onPress={() => {
            this.props.updateUser(this.state.firstName, this.state.lastName);
            this.props.navigation.navigate("Settings");
          }}
        /> */}

        <Button
          title="Save"
          onPress={() => {
            this.props.updateUser(this.state.firstName, this.state.lastName);
            this.props.navigation.navigate("Settings");
          }}
          large
          style={styles.button}
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
  title: {
    fontWeight: "bold",
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
  button: {
    paddingTop: 10,
  },
});

const mapState = (state) => ({
  name: state.user.name,
});

const mapDispatch = (dispatch) => ({
  updateUser: (f, l) => dispatch(putUserName(f, l)),
});

export default connect(mapState, mapDispatch)(ProfileSettings);
