import React, { useEffect } from "react";
import Detail from "./main/Detail";
import Account from "./main/Account";
import LandingScreen from "./main/LandingScreen";
import { StyleSheet, Text, View } from "react-native";
import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
enableScreens();
const Stack = createSharedElementStackNavigator();

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions";

import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CartIcon from "./main/CartIcon";
import CartScreen from "./main/CartScreen";

const Main = (props) => {
  useEffect(() => {
    props.fetchUser();
  }, []);

  const { currentUser } = props;
  console.log(currentUser);

  const itemListNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="List" headerMode="none">
        <Stack.Screen name="List" component={LandingScreen} />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={() => ({
            gestureEnabled: false,
            transitionSpec: {
              open: { animation: "timing", config: { duration: 1000 } },
              close: false,
            },
            cardStyleInterpolator: ({ current: { progress } }) => {
              return {
                cardStyle: {
                  opacity: progress,
                },
              };
            },
          })}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={itemListNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CartIcon name="cart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);

const styles = StyleSheet.create({});
