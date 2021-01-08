import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";

const CartIcon = ({ color, currentCart }) => {
  return (
    <View>
      <Feather name="shopping-cart" size={24} color={color} />
      <View style={styles.itemCount}>
        <Text style={styles.text}>{currentCart}</Text>
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentCart: store.cartState.length,
});

export default connect(mapStateToProps, null)(CartIcon);

const styles = StyleSheet.create({
  itemCount: {
    position: "absolute",
    bottom: 10,
    left: 17,
    backgroundColor: "orange",
    width: 20,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
