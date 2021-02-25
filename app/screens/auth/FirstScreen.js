import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function FirstScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Welcome to Digital Fashion</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.button}>
          <LinearGradient colors={["#3b3b3b", "#000000"]} style={styles.signIn}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={[styles.textSign, { color: "#fff" }]}>Sign In</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["#3b3b3b", "#000000"]}
            style={[styles.signIn, { marginTop: 15 }]}
          >
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={[styles.textSign, { color: "#fff" }]}>Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  textHeader: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 27,
  },
  textFooter: {
    color: "#05375a",
    fontSize: 18,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
