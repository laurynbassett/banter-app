import * as React from "react";
import { Text, StyleSheet, Button } from "react-native";
import languages from "../../languages.json";
import { ScrollView } from "react-native-gesture-handler";
import { List, ListItem } from "react-native-elements";
import firebase from "firebase/app";
import { fetchUser, putLang } from "../../store/user";
import { connect } from "react-redux";
import { useLinkProps } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";

const list = [
  {
    title: "Profile",
  },
  {
    title: "Notification",
  },
];

let languageArr = Object.keys(languages)
  .filter((k) => k !== "auto")
  .map(function (key) {
    return { label: languages[key], value: languages[key] };
  });

export class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.inputRefs = {};

    this.state = {
      value: "",
    };
  }

  componentDidMount() {
    this.props.grabUser();

    this.setState({
      value: this.props.user.language,
    });

    console.log(this.props.user);
  }
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ListItem
          title={"Profile"}
          // leftIcon={{ name: item.icon }}
          bottomDivider
          chevron
          onPress={() =>
            this.props.navigation.navigate("ProfileSettings", {
              user: this.props.user,
            })
          }
        />

        <ListItem
          title={"Notifications"}
          // leftIcon={{ name: item.icon }}
          bottomDivider
          chevron
          onPress={() =>
            this.props.navigation.navigate("NotificationSettings", {
              user: this.props.user,
            })
          }
        />

        <Text style={styles.label}>Language</Text>
        <RNPickerSelect
          placeholder={{}}
          items={languageArr}
          onValueChange={(value) => {
            this.setState({
              value: value,
            });
          }}
          onDonePress={() => this.props.updateLang(this.state.value)}
          onUpArrow={() => {
            this.inputRefs.name.focus();
          }}
          onDownArrow={() => {
            this.inputRefs.picker2.togglePicker();
          }}
          style={{ ...pickerSelectStyles }}
          value={this.state.value}
          ref={(el) => {
            this.inputRefs.picker = el;
          }}
          hideIcon={true}
        />

        <Button
          style={styles.button}
          title="Log Out"
          onPress={() => {
            firebase.auth().signOut();
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
  label: {
    paddingTop: 13,
    paddingBottom: 8,
    paddingLeft: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderTopWidth: 0.25,
    borderBottomWidth: 0.25,
    borderColor: "grey",
    backgroundColor: "white",
    color: "black",
  },
});

const mapState = (state) => ({
  user: state.user,
});

const mapDispatch = (dispatch) => ({
  grabUser: () => dispatch(fetchUser()),
  updateLang: (val) => dispatch(putLang(val)),
});

export default connect(mapState, mapDispatch)(SettingsScreen);
