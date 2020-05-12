import * as React from "react";
import languages from "../../languages.json";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";

let languageArr = Object.keys(languages)
  .map(function (key) {
    return languages[key];
  })
  .filter((l) => l !== "Auto Detect");

export default function Language() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {languageArr.map((lang, i) => (
        <ListItem key={i} title={lang} bottomDivider />
      ))}
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
