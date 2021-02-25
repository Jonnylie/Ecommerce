import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Button,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function Register({ navigation }) {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    checkTextInputChange: false,
    secureTextEntry: true,
    confirmSecureTextEntry: true,
  });

  const textInputChange = (input) => {
    if (input.length !== 0) {
      setDetails({
        ...details,
        email: input,
        checkTextInputChange: true,
      });
    } else {
      setDetails({
        ...details,
        email: input,
        checkTextInputChange: false,
      });
    }
  };

  const handlePasswordChange = (input) => {
    setDetails({
      ...details,
      password: input,
    });
  };

  const handleConfirmPasswordChange = (input) => {
    setDetails({
      ...details,
      confirmPassword: input,
    });
  };

  const updateSecureTextEntry = () => {
    setDetails({
      ...details,
      secureTextEntry: !details.secureTextEntry,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setDetails({
      ...details,
      confirmSecureTextEntry: !details.confirmSecureTextEntry,
    });
  };

  const signUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(details.email, details.password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set(details.name, details.email);
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Register</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.textFooter}>Name</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            placeholder="Your Name"
            autoCapitalize="none"
            onChangeText={(input) => {
              setDetails((currentState) => ({ ...currentState, name: input }));
            }}
          />
          {details.checkTextInputChange ? (
            <Feather name="check-circle" size={20} color="green" />
          ) : null}
        </View>
        <Text style={[styles.textFooter, { marginTop: 35 }]}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            placeholder="Your Email"
            autoCapitalize="none"
            onChangeText={(input) => textInputChange(input)}
          />
          {details.checkTextInputChange ? (
            <Feather name="check-circle" size={20} color="green" />
          ) : null}
        </View>
        <Text style={[styles.textFooter, { marginTop: 35 }]}>Password</Text>
        <View style={styles.action}>
          <Feather name="lock" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            placeholder="Your Password"
            secureTextEntry={details.secureTextEntry ? true : false}
            onChangeText={(input) => handlePasswordChange(input)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {details.secureTextEntry ? (
              <Feather name="eye" size={20} color="grey" />
            ) : (
              <Feather name="eye-off" size={20} color="grey" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={[styles.textFooter, { marginTop: 35 }]}>
          Confirm Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            placeholder="Your Password"
            secureTextEntry={details.confirmSecureTextEntry ? true : false}
            onChangeText={(input) => handleConfirmPasswordChange(input)}
          />
          <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
            {details.confirmSecureTextEntry ? (
              <Feather name="eye" size={20} color="grey" />
            ) : (
              <Feather name="eye-off" size={20} color="grey" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <LinearGradient colors={["#3b3b3b", "#000000"]} style={styles.signIn}>
            <TouchableOpacity style={styles.signIn} onPress={signUp}>
              <Text style={[styles.textSign, { color: "#fff" }]}>Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={[
              styles.signIn,
              {
                borderColor: "#3b3b3b",
                borderWidth: 1,
                marginTop: 15,
              },
            ]}
          >
            <Text style={[styles.textSign, { color: "#3b3b3b" }]}>Sign In</Text>
          </TouchableOpacity>
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
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05357a",
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
