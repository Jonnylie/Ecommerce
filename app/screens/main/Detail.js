import { StatusBar } from "expo-status-bar";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  Button,
  TouchableOpacity,
} from "react-native";
import data from "../../data/data";
import cloth from "../../data/cloth";
import { SharedElement } from "react-navigation-shared-element";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 30;
const CIRCLE_SIZE = width * 0.6;
const SPACING = 10;
const tabs = ["XS", "S", "M", "L"];

const Circle = ({ scrollX, variant }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {variant.map(({ color }, index) => {
        const inputRange = [
          (index - 0.55) * width,
          index * width,
          (index + 0.55) * width,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              { backgroundColor: color, opacity, transform: [{ scale }] },
            ]}
          />
        );
      })}
    </View>
  );
};
const Ticker = ({ scrollX, variant }) => {
  const inputRange = [-width, 0, width];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
  });
  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {variant.map(({ productName }, index) => {
          return (
            <Text key={index} style={styles.tickerText}>
              {productName}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Item = ({
  productName,
  price,
  imageUri,
  heading,
  description,
  index,
  scrollX,
  color,
  size,
  id,
  addToCart,
  quantity,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(tabs[0]);
  const obj = {
    imageUri: imageUri,
    color: color,
    productName: productName,
    id: id,
    price: price,
    quantity: quantity,
    size: selectedTab,
  };
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const inputRangeOpacity = [
    (index - 0.3) * width,
    index * width,
    (index + 0.3) * width,
  ];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });
  const translateXHeading = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.1, 0, -width * 0.1],
  });
  const translateXDescription = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.7, 0, -width * 0.7],
  });
  const opacity = scrollX.interpolate({
    inputRange: inputRangeOpacity,
    outputRange: [0, 1, 0],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.itemStyle}>
      <SharedElement
        id={`item.${productName}${color}.image`}
        style={[styles.imageStyle]}
      >
        <Animated.Image
          source={{ uri: imageUri }}
          style={[styles.imageStyle, { transform: [{ scale }] }]}
        />
      </SharedElement>
      <View style={styles.textContainer}>
        {/* <Animated.Text
          style={[
            styles.heading,
            { opacity, transform: [{ translateX: translateXHeading }] },
          ]}
        >
          {heading}
        </Animated.Text> */}
        <Animated.View
          style={{
            flexDirection: "row",
            alignItems: "center",
            opacity,
            transform: [{ translateX: translateXDescription }],
          }}
        >
          <Text style={styles.colorText}>Color: </Text>
          <Rectangle color={color} />
        </Animated.View>
        <Animated.Text
          style={[
            styles.description,
            { opacity, transform: [{ translateX: translateXHeading }] },
          ]}
        >
          {description}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.price,
            { opacity, transform: [{ translateX: translateXDescription }] },
          ]}
        >
          ${price}
        </Animated.Text>
        {/* <Animated.Text
          style={[
            styles.description,
            { opacity, transform: [{ translateX: translateXHeading }] },
          ]}
        >
          Select size
        </Animated.Text>
        <View style={styles.size}>
          {tabs.map((item) => {
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedTab(item)}
                style={styles.paginationDotContainer}
              >
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor:
                        selectedTab === item ? "orange" : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      {
                        color: selectedTab === item ? "white" : "#000",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View> */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => addToCart(obj)}>
          <View style={styles.backgroundButton}>
            <Text style={styles.button}>ADD</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const Pagination = ({ scrollX, variant }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-DOT_SIZE, 0, DOT_SIZE],
  });
  return (
    <View style={styles.pagination}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          { position: "absolute", transform: [{ translateX }] },
        ]}
      />
      {variant.map((item) => {
        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};

const Rectangle = ({ color }) => {
  return <View style={[styles.boxColor, { backgroundColor: color }]} />;
};

function Detail({ navigation, route, addItemToCart }) {
  const { item } = route.params;
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" hidden />
      <Circle scrollX={scrollX} variant={item.variant} />
      <Animated.FlatList
        keyExtractor={(item) => item.key}
        data={item.variant}
        renderItem={({ item, index }) => (
          <Item
            {...item}
            index={index}
            scrollX={scrollX}
            addToCart={addItemToCart}
          />
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      <AntDesign
        name="close"
        size={24}
        color="black"
        style={{ position: "absolute", top: 40, right: 20 }}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
      <Pagination scrollX={scrollX} variant={item.variant} />
      <Ticker scrollX={scrollX} variant={item.variant} />
    </View>
  );
}

Detail.sharedElements = (route, otherRoute, showing) => {
  const { item } = route.params;
  if (otherRoute.name === "List" && showing) {
    return item.variant.map(
      (item) => `item.${item.productName}${item.color}.image`
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch({ type: "ADD_TO_CART", payload: product }),
  };
};

export default connect(null, mapDispatchToProps)(Detail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  itemStyle: {
    width,
    height: height * 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: "contain",
    // backgroundColor: "red",
    flex: 1,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    top: "16%",
  },
  textContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-end",
    flex: 0.5,
  },
  heading: {
    color: "#444",
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 5,
  },
  description: {
    color: "#ccc",
    fontWeight: "600",
    textAlign: "left",
    width: width * 0.75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.3,
  },
  colorText: {
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 2,
    marginBottom: 5,
    lineHeight: 16 * 3,
  },
  boxColor: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  price: {
    color: "#444",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 5,
    lineHeight: 16 * 3,
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: "contain",
    position: "absolute",
    left: 10,
    bottom: 20,
    transform: [
      { translateX: -LOGO_WIDTH / 2 },
      { translateY: -LOGO_HEIGHT / 2 },
      { rotateZ: "-90deg" },
      { translateX: LOGO_WIDTH / 2 },
      { translateY: LOGO_HEIGHT / 2 },
    ],
  },
  size: {
    flexDirection: "row",
  },
  pagination: {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  tickerContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    overflow: "hidden",
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    fontWeight: "800",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 2,
    borderRadius: 12,
  },
  pillText: {
    fontWeight: "700",
  },
});
