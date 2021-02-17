import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import * as firebase from "firebase";
import "firebase/firestore";

export const tabs = ["Headphones", "Headset", "Earphones", "Wireless"];
const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export default function LandingScreen({ navigation }) {
  const [newArrivals, setNewArrivals] = React.useState([]);
  const [bestSellers, setBestSellers] = React.useState([]);
  const [featured, setFeatured] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const dbh = firebase.firestore();
  const [selectedTab, setSelectedTab] = React.useState(tabs[0]);
  const initialIndex = 2;
  const initialIndex2 = 0;
  // change the scroll position to index (n) * item width
  const scrollX = React.useRef(new Animated.Value(initialIndex * ITEM_SIZE))
    .current;

  const scrollX2 = React.useRef(new Animated.Value(initialIndex2 * ITEM_SIZE))
    .current;

  useEffect(() => {
    const newArrivals = dbh
      .collection("products")
      .doc("new_arrivals")
      .onSnapshot((documentSnapshot) => {
        let data = documentSnapshot.data();
        data.items.unshift({ key: "left-spacer" });
        data.items.push({ key: "right-spacer" });
        setNewArrivals(data);
      });

    const bestSellers = dbh
      .collection("products")
      .doc("best_sellers")
      .onSnapshot((documentSnapshot) => {
        let data = documentSnapshot.data();
        setBestSellers(data);
      });

    const featured = dbh
      .collection("products")
      .doc("featured")
      .onSnapshot((documentSnapshot) => {
        let data = documentSnapshot.data();
        setFeatured(data);
      });

    const categoryList = dbh
      .collection("categories")
      .doc("CtvYpI32IzXT9zs6WYha")
      .onSnapshot((documentSnapshot) => {
        setCategories(documentSnapshot.data().items);
        console.log(categories);
      });

    // Stop listening for updates when no longer required
    return () => newArrivals() && featured() && bestSellers() && categoryList();
  }, []);

  if (newArrivals.items && featured.items && bestSellers.items) {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <StatusBar hidden />
          <FlatList
            data={categories}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ padding: SPACING }}
            renderItem={({ item: tab }) => {
              return (
                <TouchableOpacity onPress={() => setSelectedTab(tab)}>
                  <View
                    style={[
                      styles.pill,
                      {
                        backgroundColor:
                          selectedTab === tab ? "orange" : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        {
                          color: selectedTab === tab ? "white" : "#000",
                        },
                      ]}
                    >
                      {tab}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "800",
              fontSize: 22,
              marginTop: 20,
            }}
          >
            New Arrivals
          </Text>
          <Animated.FlatList
            showsHorizontalScrollIndicator={false}
            data={newArrivals.items}
            keyExtractor={(item) => item.key}
            horizontal
            height={ITEM_SIZE * 1.4}
            // style={{ backgroundColor: "dodgerblue" }}
            bounces={false}
            decelerationRate={0}
            renderToHardwareTextureAndroid
            contentContainerStyle={{
              alignItems: "flex-start",
              // padding: EMPTY_ITEM_SIZE,
            }}
            snapToInterval={ITEM_SIZE}
            snapToAlignment="start"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            // Change initial scroll index by adding these two props below
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => ({
              index,
              offset: ITEM_SIZE * index,
              length: data.length,
            })}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              if (!item.imageUri) {
                return <View style={{ width: EMPTY_ITEM_SIZE }} />;
              }

              const inputRange = [
                (index - 2) * ITEM_SIZE,
                (index - 1) * ITEM_SIZE,
                index * ITEM_SIZE,
              ];

              const translateY = scrollX.interpolate({
                inputRange,
                outputRange: [80, 30, 80],
                extrapolate: "clamp",
              });

              return (
                <TouchableOpacity
                  style={{ width: ITEM_SIZE }}
                  onPress={() => navigation.push("Detail", { item })}
                >
                  <Animated.View
                    style={{
                      marginHorizontal: SPACING,
                      padding: SPACING * 2,
                      alignItems: "center",
                      transform: [{ translateY }],
                      backgroundColor: item.backgroundColor,
                      borderRadius: 34,
                      height: ITEM_SIZE,
                      alignSelf: "center",
                      borderColor: "grey",
                      padding: 20,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                      elevation: Platform.OS === "android" ? 0 : 1,
                    }}
                  >
                    <SharedElement
                      id={`item.${item.productName}${item.sharedElementId}.image`}
                      style={styles.image}
                    >
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.image}
                      />
                    </SharedElement>
                    <Text style={styles.type}>{item.productName}</Text>
                    <Text style={styles.subType}>{"$" + item.price}</Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            }}
          />
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                alignSelf: "center",
                fontWeight: "800",
                fontSize: 22,
                marginBottom: 30,
              }}
            >
              Featured
            </Text>
            <Animated.FlatList
              showsHorizontalScrollIndicator={false}
              data={featured.items}
              keyExtractor={(item) => item.key}
              horizontal
              height={width * 0.6}
              bounces={false}
              decelerationRate={0}
              renderToHardwareTextureAndroid
              contentContainerStyle={{
                alignItems: "flex-start",
                // padding: EMPTY_ITEM_SIZE,
              }}
              // snapToInterval={ITEM_SIZE}
              // snapToAlignment="start"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX2 } } }],
                { useNativeDriver: false }
              )}
              // Change initial scroll index by adding these two props below
              getItemLayout={(data, index) => ({
                index,
                offset: ITEM_SIZE * index,
                length: data.length,
              })}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                const inputRange = [
                  (index - 2) * ITEM_SIZE,
                  (index - 1) * ITEM_SIZE,
                  index * ITEM_SIZE,
                ];

                const translateY = scrollX2.interpolate({
                  inputRange,
                  outputRange: [100, 50, 100],
                  extrapolate: "clamp",
                });

                return (
                  <TouchableOpacity
                    style={{ width: width / 2.2 }}
                    onPress={() => navigation.push("Detail", { item })}
                  >
                    <View>
                      <Animated.View
                        style={{
                          marginHorizontal: SPACING,
                          padding: SPACING * 2,
                          alignItems: "center",
                          // transform: [{ translateY }],
                          backgroundColor: item.backgroundColor,
                          borderRadius: 34,
                          height: width * 0.45,
                          marginBottom: 5,
                        }}
                      >
                        <SharedElement
                          id={`item.${item.productName}${item.color}.image`}
                        >
                          <Image
                            source={{ uri: item.imageUri }}
                            style={styles.gridImage}
                          />
                        </SharedElement>
                      </Animated.View>
                      <View style={{ alignItems: "center" }}>
                        <Text style={styles.smallType}>{item.productName}</Text>
                        <Text style={styles.smallSubType}>
                          {"$" + item.price}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "800",
              fontSize: 22,
              marginBottom: 30,
            }}
          >
            Best Sellers
          </Text>
          <View style={{ alignItems: "center" }}>
            <Animated.FlatList
              data={bestSellers.items}
              keyExtractor={(item) => item.key}
              // style={{ backgroundColor: "dodgerblue" }}
              numColumns={2}
              renderToHardwareTextureAndroid
              contentContainerStyle={{
                alignItems: "flex-start",
                // padding: EMPTY_ITEM_SIZE,
              }}
              // Change initial scroll index by adding these two props below
              initialScrollIndex={initialIndex2}
              getItemLayout={(data, index) => ({
                index,
                offset: ITEM_SIZE * index,
                length: data.length,
              })}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={{ width: width / 2.1, marginBottom: 10 }}
                    onPress={() => navigation.push("Detail", { item })}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Animated.View
                        style={{
                          marginHorizontal: SPACING * 0.5,
                          padding: SPACING * 2,
                          alignItems: "center",
                          // transform: [{ translateY }],
                          backgroundColor: item.backgroundColor,
                          borderRadius: 34,
                          height: width * 0.5,
                          marginBottom: 5,
                        }}
                      >
                        <SharedElement
                          id={`item.${item.productName}${item.color}.image`}
                        >
                          <Image
                            source={{ uri: item.imageUri }}
                            style={styles.gridImage}
                          />
                        </SharedElement>
                      </Animated.View>
                      <Text style={styles.smallType}>{item.productName}</Text>
                      <Text style={styles.smallSubType}>
                        {"$" + item.price}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
  return (
    <View>
      <Text>Content is Loading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  pill: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 2,
    borderRadius: 12,
  },
  pillText: {
    fontWeight: "700",
  },
  type: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 22,
    marginBottom: 3,
  },
  subType: {
    fontSize: 12,
    opacity: 0.8,
  },
  smallType: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 3,
  },
  smallSubType: {
    fontSize: 12,
    opacity: 0.8,
  },
  image: {
    width: ITEM_SIZE * 0.75,
    resizeMode: "contain",
    alignSelf: "center",
    flex: 1,
  },
  gridImage: {
    width: width * 0.35,
    resizeMode: "contain",
    alignSelf: "center",
    flex: 1,
  },
});
