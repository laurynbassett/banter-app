import * as React from "react";
import { Text, StyleSheet, Button, Picker } from "react-native";
import languages from "../../languages.json";
import { ScrollView } from "react-native-gesture-handler";
import { List, ListItem } from "react-native-elements";
import firebase from "firebase/app";
import { fetchUser, putLang } from "../../store/user";
import { connect } from "react-redux";
import { useLinkProps } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

const list = [
  {
    title: "Profile",
  },
  {
    title: "Language",
  },
];

let languageArr = Object.keys(languages)
  .filter((k) => k !== "auto")
  .map(function (key) {
    return { label: languages[key], value: key };
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

    this.setState({ value: this.props.user.language });

    console.log(this.props.user);
  }
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            // leftIcon={{ name: item.icon }}
            bottomDivider
            chevron
            onPress={() =>
              this.props.navigation.navigate(`${item.title}Settings`, {
                user: this.props.user,
              })
            }
          />
        ))}
        <Text>Language:</Text>
        <RNPickerSelect
          // placeholder={{
          //   label: "Select a language...",
          //   value: null,
          // }}
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
          value={this.props.user.value}
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
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
