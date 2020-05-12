import * as React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, ListItem } from "react-native-elements";
import firebase from "firebase/app";

const list = [
  {
    title: "Profile",
  },
  {
    title: "Language",
  },
];

export default function SettingsScreen({ navigation }) {
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
            navigation.navigate(`Settings`, { screen: `${item.title}Settings` })
          }
        />
      ))}
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
