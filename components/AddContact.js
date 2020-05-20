import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { connect } from "react-redux";

import { addNewContact, fetchUser } from "../store";

const AddContact = props => {
  const [ email, setEmail ] = useState("");

  const fetchData = async () => {
    await props.fetchUser;
  };

  useEffect(() => {
    fetchData();
  });

  const handleAdd = () => {
    props.addNewContact({ email }, props.navigation);
    setEmail("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.input}>
          <TextInput
            autoCapitalize='none'
            placeholder='Email'
            style={styles.text}
            value={email}
            onChangeText={value => setEmail(value)}
          />
        </View>
      </View>
      <View style={styles.buttonTextWrapper}>
        <Button title='Add Contact' style={styles.button} onPress={handleAdd} />
        <View style={styles.buttonTextWrapper}>
          <Text style={[ styles.text, { color: "red" } ]}>{props.addContactError}</Text>
        </View>
      </View>
    </View>
  );
};

const mapState = state => ({
  user: state.user,
  addContactError: state.user.addContactError
});

const mapDispatch = dispatch => ({
  addNewContact: (contact, navigation) => dispatch(addNewContact(contact, navigation)),
  fetchUser: () => dispatch(fetchUser())
});

export default connect(mapState, mapDispatch)(AddContact);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  form: {
    justifyContent: "center"
  },
  input: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10
  },
  text: {
    fontSize: 16,
    height: 40
  },
  button: {
    flex: 1
  },
  buttonTextWrapper: {
    marginTop: 20,
    alignItems: "center"
  }
});
