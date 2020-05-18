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

export class NewChat extends Component {
  render() {
    return (
      <View
        style={styles.container}
        // contentContainerStyle={styles.contentContainer}
      >
        <Text>New Chat</Text>
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
          sections={[
            { title: "D", data: ["Devin", "Dan", "Dominic"] },
            {
              title: "J",
              data: [
                "Jackson",
                "James",
                "Jillian",
                "Jimmy",
                "Joel",
                "John",
                "Julie",
              ],
            },
          ]}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
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
