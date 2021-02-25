import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from "firebase";

export default function Account({ navigation }) {
  const dbh = firebase.firestore();
  const [myAccount, setMyAccount] = React.useState("");

  useEffect(() => {
    dbh
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setMyAccount(documentSnapshot.data().name);
        }
      });
  }, []);

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Hi {myAccount}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.button}>
          <LinearGradient colors={["#3b3b3b", "#000000"]} style={styles.signIn}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => navigation.navigate("PurchaseHistory")}
            >
              <Text style={[styles.textSign, { color: "#fff" }]}>
                Purchase History
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["#3b3b3b", "#000000"]}
            style={[styles.signIn, { marginTop: 15 }]}
          >
            <TouchableOpacity style={styles.signIn} onPress={signOut}>
              <Text style={[styles.textSign, { color: "#fff" }]}>Sign Out</Text>
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
    fontSize: 30,
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
