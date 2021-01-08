import React from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

import colors from "../config/colors";

export default function ViewImageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.closeIcon} />
        <View style={styles.deleteIcon} />
        <Image source={require("../assets/chair.jpg")} style={styles.image} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  background: {
    backgroundColor: colors.black,
    flex: 1,
    flexDirection: "column", // Primary: Y axis
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 10,
    left: 20,
    backgroundColor: colors.primary,
  },
  deleteIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: colors.secondary,
  },
});
