import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  SectionList,
  ListView,
  View,
} from "react-native";
import { Button, ListItem } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";

const getHeaders = (contacts) => {
  let letters = contacts
    .map((contactObj) => contactObj.name[0].toUpperCase())
    .sort();

  const uniques = [...new Set(letters)];

  return uniques.map((letter) => ({ title: letter, data: [] }));
};

export class NewChat extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    let contacts = this.props.contacts;
    const data = getHeaders(contacts);
    console.log(data);
    contacts.forEach((obj) => {
      const firstLetter = obj.name[0].toUpperCase();
      const index = data.findIndex((obj) => obj.title === firstLetter);

      data[index].data.push(obj);
    });
    this.setState({ data });
  }

  render() {
    console.log(this.state.data);
    return (
      <View
        style={styles.container}
        // contentContainerStyle={styles.contentContainer}
      >
        <ListItem
          title={"New Group"}
          // leftIcon={() => <Ionicons name="people-outline" />}
          bottomDivider
          // onPress={() =>
          // }
        />
        <ListItem
          title={"New Contact"}
          bottomDivider
          // onPress={() =>
          // }
        />

        <SectionList
          sections={this.state.data}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.name}</Text>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
          checkmark
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: "white",
  },
});

const mapState = (state) => ({
  contacts: state.user.contacts,
});

export default connect(mapState)(NewChat);
