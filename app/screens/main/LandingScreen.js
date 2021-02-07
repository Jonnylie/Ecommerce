import React, { useEffect } from "react";
import cloth from "../../data/cloth";
import data from "../../data/data";
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
import * as firebase from 'firebase'
import 'firebase/firestore';  

export const tabs = ["Headphones", "Headset", "Earphones", "Wireless"];
const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export default function LandingScreen({ navigation }) {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const dbh = firebase.firestore();
  const [selectedTab, setSelectedTab] = React.useState(tabs[0]);
  const initialIndex = 2;
  const initialIndex2 = 1;
  // change the scroll position to index (n) * item width
  const scrollX = React.useRef(new Animated.Value(initialIndex * ITEM_SIZE))
    .current;

  const scrollX2 = React.useRef(new Animated.Value(initialIndex2 * ITEM_SIZE))
    .current;

  useEffect(() => {
    const productsData = dbh.collection('products')
    .doc('new_arrivals')
    .onSnapshot(documentSnapshot => {
      let data = documentSnapshot.data();
      data.items.unshift({ key: "left-spacer" })
      data.items.push({ key: "right-spacer" })
      setProducts(data);
    });

    const categoryList = dbh.collection('categories')
    .doc('CtvYpI32IzXT9zs6WYha')
    .onSnapshot(documentSnapshot => {
      setCategories(documentSnapshot.data().items);
      console.log(categories);
    });

    // Stop listening for updates when no longer required
    return () => productsData() && categoryList();
    }, []);
  
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
        {products.items && <Text
          style={{
            alignSelf: "center",
            fontWeight: "800",
            fontSize: 22,
            marginTop: 20,
          }}
        >
          New Arrivals
        </Text>}
        {products.items && <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={products.items}
          keyExtractor={(item) => item.key}
          horizontal
          height={400}
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
                    backgroundColor: item.color,
                    borderRadius: 34,
                    height: ITEM_SIZE,
                  }}
                >
                  <SharedElement
                    id={`item.${item.color}.image`}
                    style={styles.image}
                  >
                    <Image source={{ uri: item.imageUri}} style={styles.image} />
                  </SharedElement>
                  <Text style={styles.type}>{item.productName}</Text>
                  <Text style={styles.subType}>{"$" + item.price}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />}
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
          data={cloth}
          keyExtractor={(item) => item.key}
          horizontal
          height={360}
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
            [{ nativeEvent: { contentOffset: { x: scrollX2 } } }],
            { useNativeDriver: false }
          )}
          // Change initial scroll index by adding these two props below
          initialScrollIndex={initialIndex2}
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

            const translateY = scrollX2.interpolate({
              inputRange,
              outputRange: [100, 50, 100],
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
                    // transform: [{ translateY }],
                    backgroundColor: item.color,
                    borderRadius: 34,
                    height: ITEM_SIZE,
                  }}
                >
                  {/* <SharedElement
                    id={`item.${item.color}.image`}
                    style={styles.image}
                  > */}
                  <Image source={item.imageUri} style={styles.image} />
                  {/* </SharedElement> */}
                  <Text style={styles.type}>{item.type}</Text>
                  <Text style={styles.subType}>{"$" + item.price}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />
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
            data={data}
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
                  <Animated.View
                    style={{
                      marginHorizontal: SPACING * 0.5,
                      padding: SPACING * 2,
                      alignItems: "center",
                      // transform: [{ translateY }],
                      backgroundColor: item.color,
                      borderRadius: 34,
                      height: width * 0.6,
                    }}
                  >
                    {/* <SharedElement
                    id={`item.${item.color}.image`}
                    style={styles.image}
                  > */}
                    <Image source={item.imageUri} style={styles.gridImage} />
                    {/* </SharedElement> */}
                    <Text style={styles.type}>{item.type}</Text>
                    <Text style={styles.subType}>{"$" + item.price}</Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
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
    fontWeight: "600",
    fontSize: 22,
  },
  subType: {
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
