// FUSE-EXPO/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import NfcFunctionality from './Screens/NfcFunctionality';
import QrCodeFunctionality from './Screens/QrCodeFunctionality';
import Profile from './Screens/profile';
import MyCard from './Screens/MyCards'; // Import MyCard

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  NfcFunctionality: undefined;
  QrCodeFunctionality: undefined;
  Profile: undefined;
  MyCard: undefined; // Add MyCard to the navigation stack
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NfcFunctionality"
          component={NfcFunctionality}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QrCodeFunctionality"
          component={QrCodeFunctionality}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyCard" // Add the MyCard screen to the navigator
          component={MyCard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
