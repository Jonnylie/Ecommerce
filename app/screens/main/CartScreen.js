import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";

const { width, height } = Dimensions.get("window");
const boxWidth = width * 0.9;
const buttonWidth = boxWidth * 0.9;
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;

const Rectangle = ({ item }) => {
  return <View style={[styles.boxColor, { backgroundColor: item.color }]} />;
};

function CartFooter({ cartItems, navigation, setIsLoading }) {
  const totalPrice = cartItems.totalPrice.toFixed(2);

  const PlaceOrder = () => {
    setIsLoading(true);
    const dbh = firebase.firestore();
    dbh
      .collection("orders")
      .add(cartItems)
      .then(() => {
        setTimeout(async () => {
          await setIsLoading(false);
          await navigation.navigate("List");
        }, 2500);
      });
  };

  return (
    <View
      style={{
        alignSelf: "center",
        borderColor: "grey",
        padding: 20,
        backgroundColor: "white",
        width: width * 0.9,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <Text
        style={{ marginBottom: 10 }}
      >{`ORDER SUMMARY | ${cartItems.numberCart} ITEM(S)`}</Text>
      <View
        style={{
          borderBottomColor: "grey",
          borderBottomWidth: 0.5,
          marginBottom: 10,
        }}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Text>ORDER TOTAL</Text>
        <Text style={{ textAlign: "right", flex: 1 }}>{totalPrice}</Text>
      </View>
      <View
        style={{
          borderBottomColor: "grey",
          borderBottomWidth: 0.5,
          marginBottom: 10,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ width: buttonWidth, alignSelf: "center" }}
        onPress={PlaceOrder}
      >
        <View style={styles.backgroundButton}>
          <Text style={styles.button}>Place Order</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function CartScreen({
  cartItems,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  navigation,
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  function TotalPrice(price, quantity) {
    return (price * quantity).toFixed(2);
  }
  console.log(cartItems);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/order-has-been-placed.json")}
          autoPlay
          loop
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      {cartItems.Carts.length > 0 ? (
        <FlatList
          data={cartItems.Carts}
          keyExtractor={(item, index) => `${item}-${index}`}
          // style={{ backgroundColor: "dodgerblue" }}
          scrollEventThrottle={16}
          ListFooterComponent={() => (
            <CartFooter
              cartItems={cartItems}
              navigation={navigation}
              setIsLoading={setIsLoading}
            />
          )}
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
                <Image source={{ uri: item.imageUri }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.productName}>{item.productName}</Text>
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
    width: 200,
    height: 200,
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
    alignSelf: "center",
  },
});
