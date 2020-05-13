import * as React from "react";
import { StyleSheet, Button, Switch } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, ListItem } from "react-native-elements";
import firebase from "firebase/app";
import { fetchUser } from "../../store/user";
import { connect } from "react-redux";
import { useLinkProps } from "@react-navigation/native";

const list = [
  {
    title: "Profile",
  },
  {
    title: "Language",
  },
];

export class SettingsScreen extends React.Component {
  render() {
    this.props.grabUser();
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
              this.props.navigation.navigate(`${item.title}Settings`)
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

const mapDispatch = (dispatch) => ({
  grabUser: () => dispatch(fetchUser()),
});

export default connect(null, mapDispatch)(SettingsScreen);
