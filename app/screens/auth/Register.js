import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Button,
  StatusBar,
} from "react-native";
import firebase from "firebase";

export default function Register({ navigation }) {
  const [{ name, email, password }, setDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const signUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({ name, email });
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  return (
    <SafeAreaView>
      <StatusBar hidden />
      <TextInput
        placeholder="name"
        onChangeText={(input) => {
          setDetails((currentState) => ({ ...currentState, name: input }));
        }}
      />
      <TextInput
        placeholder="email"
        onChangeText={(input) => {
          setDetails((currentState) => ({ ...currentState, email: input }));
        }}
      />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(input) => {
          setDetails((currentState) => ({
            ...currentState,
            password: input,
          }));
        }}
      />
      <Button title="Sign Up" onPress={signUp} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
