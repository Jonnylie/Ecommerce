import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;

const Rectangle = ({ item }) => {
  return <View style={[styles.boxColor, { backgroundColor: item.color }]} />;
};

function CartScreen({
  cartItems,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
}) {
  function TotalPrice(price, quantity) {
    return (price * quantity).toFixed(2);
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => `${item}-${index}`}
          // style={{ backgroundColor: "dodgerblue" }}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  padding: SPACING * 2,
                  alignItems: "center",
                  // backgroundColor: item.color,
                  borderRadius: 34,
                  height: ITEM_SIZE,
                  width: width,
                  flexDirection: "row",
                }}
              >
                <Image source={item.imageUri} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={styles.name}>Color: </Text>
                    <Rectangle item={item} />
                  </View>
                  <Text style={styles.name}>Size: {item.size}</Text>
                  <Text style={styles.price}>
                    {TotalPrice(item.price, item.quantity)}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => removeItem(item)}
                  >
                    <View style={styles.backgroundButton}>
                      <Text style={styles.button}>REMOVE</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <AntDesign
                    onPress={() => {
                      increaseQuantity(item);
                    }}
                    name="plussquareo"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <AntDesign
                    onPress={() => {
                      decreaseQuantity(item);
                    }}
                    name="minussquareo"
                    size={24}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text>Your cart is empty</Text>
      )}
    </SafeAreaView>
  );
}

const mapStateToProps = ({ cartState }) => ({
  cartItems: cartState,
});

const mapDispatchToProps = (dispatch) => {
  return {
    removeItem: (product) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: product }),
    increaseQuantity: (product) =>
      dispatch({ type: "INCREASE_QUANTITY", payload: product }),
    decreaseQuantity: (product) =>
      dispatch({ type: "DECREASE_QUANTITY", payload: product }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  productName: {
    paddingBottom: 20,
    fontWeight: "500",
    fontSize: 20,
  },
  price: {
    paddingBottom: 20,
    fontWeight: "500",
    fontSize: 20,
    marginTop: 20,
  },
  name: {
    fontWeight: "400",
    fontSize: 14,
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
    flex: 1,
    marginVertical: 20,
  },
  boxColor: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  info: {
    padding: 20,
    marginRight: 30,
  },
  quantity: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "700",
    alignSelf: "center",
  },
  backgroundButton: {
    marginTop: 20,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  button: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
});
