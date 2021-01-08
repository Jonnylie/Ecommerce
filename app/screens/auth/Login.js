import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  View,
  StatusBar,
} from "react-native";
import firebase from "firebase";

export default function Login() {
  const [{ email, password }, setDetails] = useState({
    email: "",
    password: "",
  });

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  return (
    <SafeAreaView>
      <StatusBar hidden />
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
      <Button title="Sign In" onPress={signIn} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
