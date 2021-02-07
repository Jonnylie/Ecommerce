// @refresh reset
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  StatusBar,
  LogBox,
} from "react-native";
import Detail from "./app/screens/main/Detail";
import FirstScreen from "./app/screens/auth/FirstScreen";
import LandingScreen from "./app/screens/main/LandingScreen";
import Register from "./app/screens/auth/Register";
import Login from "./app/screens/auth/Login";
import MainScreen from "./app/screens/Main";

import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { NavigationContainer } from "@react-navigation/native";
enableScreens();
import * as firebase from "firebase";
import "firebase/firestore";

import { Provider } from "react-redux";
// import store from "./app/redux/store/index";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./app/redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));

var firebaseConfig = {
  apiKey: "AIzaSyAkJJXB6dQzE3TCaT0By0cS7VxwbutTUmE",
  authDomain: "digitalfashion-cab77.firebaseapp.com",
  projectId: "digitalfashion-cab77",
  storageBucket: "digitalfashion-cab77.appspot.com",
  messagingSenderId: "554097542048",
  appId: "1:554097542048:web:cc0632034c0527c1c19ac5",
  measurementId: "G-3G62PW0VHS"
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
LogBox.ignoreLogs([
  "It appears that you are using old version of react-navigation library",
]);
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
]);

const Stack = createSharedElementStackNavigator();

export default function App() {
  const [{ loggedIn, loaded }, setUser] = useState({
    loggedIn: false,
    loaded: false,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setUser({ loggedIn: false, loaded: true });
      } else {
        setUser({ loggedIn: true, loaded: true });
      }
    });
    // return () => {
    //   cleanup
    // }
  }, []);

  if (!loaded) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="First" headerMode="none">
          <Stack.Screen name="First" component={FirstScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Provider store={store}>
        <MainScreen />
      </Provider>
    </NavigationContainer>
  );
}
