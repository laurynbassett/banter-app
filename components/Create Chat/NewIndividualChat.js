import React, { Component } from "react";
import { StyleSheet, Text, Button, SectionList, View } from "react-native";
import { ListItem } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";
import { createSectionedData } from "../../utils";

export class NewIndividualChat extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // Transforming contacts data into correct format for SectionList
    const data = createSectionedData(this.props.contacts);
    this.setState({ data });

    // Overriding header buttons
    this.props.navigation.setOptions({
      headerLeft: () => (
        <Button
          title="Cancel"
          onPress={() => this.props.navigation.navigate("Chat")}
        />
      ),
    });
  }

  handleContactSelection() {}

  render() {
    return (
      <View style={styles.container}>
        <ListItem
          title={"New Group"}
          leftIcon={() => <Entypo name="users" size={20} style={styles.icon} />}
          bottomDivider
          onPress={() => this.props.navigation.navigate("NewGroupChat")}
        />
        <ListItem
          title={"New Contact"}
          leftIcon={() => (
            <Entypo name="add-user" size={20} style={styles.icon} />
          )}
          bottomDivider
          onPress={() => console.log("pressed")}
        />

        <SectionList
          sections={this.state.data}
          renderItem={({ item }) => (
            <ListItem title={item.name} bottomDivider />
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

export default connect(mapState)(NewIndividualChat);
