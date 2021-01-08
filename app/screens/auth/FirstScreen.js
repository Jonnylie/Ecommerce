import React from "react";
import { StyleSheet, SafeAreaView, View, Button } from "react-native";

export default function FirstScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Button title="Login" onPress={() => navigation.push("Login")}></Button>
      <Button
        title="Register"
        onPress={() => navigation.push("Register")}
      ></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
