import React, { Component } from "react";
import { StyleSheet, Text, Button, SectionList, View } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { createSectionedData, findIndices } from "../../utils";

export class NewGroupChat extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.checkItem = this.checkItem.bind(this);
  }

  componentDidMount() {
    // Transforming contacts data into correct format for SectionList
    const data = createSectionedData(this.props.contacts);
    this.setState({ data });

    // Overriding header buttons
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button title="Create Group" onPress={() => console.log("pressed")} />
      ),
      headerLeft: () => (
        <Button
          title="Cancel"
          onPress={() => this.props.navigation.navigate("Chat")}
        />
      ),
    });
  }

  checkItem(itemName, itemId) {
    const { sectionIndex, nameIndex } = findIndices(
      itemName,
      itemId,
      this.state.data
    );

    return this.state.data[sectionIndex].data[nameIndex].checked;
  }

  handlePress(itemName, itemId) {
    const data = this.state.data;
    const { sectionIndex, nameIndex } = findIndices(itemName, itemId, data);

    data[sectionIndex].data[nameIndex].checked = !data[sectionIndex].data[
      nameIndex
    ].checked;

    this.setState({ data });
  }

  getSelected() {
    let selected = [];

    this.state.data.forEach((section) => {
      section.forEach((contact) => {
        if (contact.checked === true) {
          selected.push({ contactId: contact.id, contactName: contact.name });
        }
      });
    });

    return selected;
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              bottomDivider
              checkBox={{
                onIconPress: () => this.handlePress(item.name, item.id),
                checked: this.checkItem(item.name, item.id),
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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
});

const mapState = (state) => ({
  contacts: state.user.contacts,
});

export default connect(mapState)(NewGroupChat);
