import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Button,
  ScrollView,
  SectionList,
  ListView,
  View,
} from "react-native";
import { ListItem } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";

const getHeaders = (contacts) => {
  let letters = contacts
    .map((contactObj) => contactObj.name[0].toUpperCase())
    .sort();

  const uniques = [...new Set(letters)];

  return uniques.map((letter) => ({ title: letter, data: [] }));
};

export class NewIndividualChat extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.checked = this.checked.bind(this);
    this.indexOfNamesArray = this.indexOfNamesArray.bind(this);
    this.indexOfSectionArray = this.indexOfSectionArray.bind(this);
  }

  componentDidMount() {
    let contacts = this.props.contacts;
    const data = getHeaders(contacts);
    contacts.forEach((obj) => {
      const firstLetter = obj.name[0].toUpperCase();
      const index = data.findIndex((obj) => obj.title === firstLetter);
      obj.checked = false;
      data[index].data.push(obj);
    });

    this.setState({ data });

    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create Group"
          onPress={() => console.log("pressed")}
        ></Button>
      ),
      // headerLeft: () => <Button title="Cancel"></Button>,
    });
  }

  indexOfSectionArray(name, data) {
    const firstLetter = name[0].toUpperCase();
    return data.findIndex((obj) => obj.title === firstLetter);
  }

  indexOfNamesArray(userId, data, sectionIndex) {
    return data[sectionIndex].data.findIndex((obj) => obj.id === userId);
  }

  checked(itemName, itemId) {
    const section = this.indexOfSectionArray(itemName, this.state.data);
    const name = this.indexOfNamesArray(itemId, this.state.data, section);

    return this.state.data[section].data[name].checked;
  }

  handlePress(itemName, itemId) {
    const section = this.indexOfSectionArray(itemName, this.state.data);
    const name = this.indexOfNamesArray(itemId, this.state.data, section);

    const data = this.state.data;
    data[section].data[name].checked = !data[section].data[name].checked;

    this.setState({ data });
  }

  getSelected() {
    let selected = [];

    this.state.data.forEach((section) => {
      section.forEach((contact) => {
        if (contact.checked === true) {
          selected.push(contact);
        }
      });
    });

    return selected;
  }

  render() {
    return (
      <View
        style={styles.container}
        // contentContainerStyle={styles.contentContainer}
      >
        <ListItem
          title={"New Group"}
          leftIcon={() => <Entypo name="users" size={20} style={styles.icon} />}
          bottomDivider
          // onPress={() =>
          // }
        />
        <ListItem
          title={"New Contact"}
          leftIcon={() => (
            <Entypo name="add-user" size={20} style={styles.icon} />
          )}
          bottomDivider
          // onPress={() =>
          // }
        />

        <SectionList
          sections={this.state.data}
          renderItem={({ item }) => (
            // <Text style={styles.item}>{item.name}</Text>
            <ListItem
              title={item.name}
              bottomDivider
              checkBox={{
                onIconPress: () => this.handlePress(item.name, item.id),
                checked: this.checked(item.name, item.id),
              }}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
          stickySectionHeadersEnabled
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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

export default connect(mapState)(NewIndividualChat);
