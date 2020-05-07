import React from "react";
import { View, Text, StyleSheet } from "react-native";

class DoneScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Done Screen</Text>
      </View>
    );
  }
}

export default DoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
