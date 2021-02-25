import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import UndrawOrderDelivered from "../../assets/UndrawOrderDelivered";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import * as firebase from "firebase";

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;

const Rectangle = ({ item }) => {
  return <View style={[styles.boxColor, { backgroundColor: item.color }]} />;
};

const PurchaseHistory = () => {
  const dbh = firebase.firestore();
  const [orders, setOrders] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    let orderHistory = new Array();
    dbh
      .collection("orders")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .orderBy("purchaseTimestamp", "desc")
      .get()
      .then((documentSnapshot) => {
        documentSnapshot.forEach((doc) => {
          doc.data().Carts.map((element) => {
            orderHistory.push(element);
          });
        });
        orderHistory.sort((x, y) => {
          return x.timestamp - y.timestamp;
        });
        setOrders(orderHistory);
      });
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => `${item}-${index}`}
          // style={{ backgroundColor: "dodgerblue" }}
          scrollEventThrottle={16}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  padding: SPACING * 2,
                  alignItems: "center",
                  borderRadius: 34,
                  height: ITEM_SIZE / 1.5,
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
                  <Text style={styles.name}>
                    Purchase Date: {item.purchaseDate}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <UndrawOrderDelivered />
          <Text style={{ fontWeight: "600", fontSize: 20, marginBottom: 10 }}>
            No orders yet
          </Text>
          <Text>When you place your first order, it will appear here</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("List")}
          >
            <View style={styles.backgroundButton}>
              <Text style={styles.button}>Buy product</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PurchaseHistory;

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
  },
  name: {
    fontWeight: "400",
    fontSize: 14,
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
    flex: 1,
    width: width * 0.3,
    height: width * 0.3,
  },
  boxColor: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  info: {
    flex: 1,
    padding: 10,
    // marginRight: 30,
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
