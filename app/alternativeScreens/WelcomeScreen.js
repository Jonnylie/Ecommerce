import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.imageBackground}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo-red.png")}
            style={styles.logo}
          />
          <Text>Sell What You Don't Need</Text>
        </View>
        <View style={styles.loginButton} />
        <View style={styles.registerButton} />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  imageBackground: {
    flex: 1,
    flexDirection: "column", // Primary: Y axis
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  loginButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#4ECDC4",
  },
  registerButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#fc5c65",
  },
});
