import React from "react";
import cloth from "../data/cloth";
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
  TouchableWithoutFeedback,
  Animated,
} from "react-native";

export const tabs = ["Sunday", "Monday", "Tuesday", "Wednesday"];
const { width, height } = Dimensions.get("window");
const SPACING = 10;

export default function TabSceen() {
  const [selectedTab, setSelectedTab] = React.useState(tabs[0]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <FlatList
        data={tabs}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, backgroundColor: "green" }}
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
    </SafeAreaView>
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
    fontWeight: "800",
    fontSize: 22,
  },
  subType: {
    fontSize: 12,
    opacity: 0.8,
  },
});
