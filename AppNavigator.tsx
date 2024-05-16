import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import NfcFunctionality from './Screens/NfcFunctionality';
import QrCodeFunctionality from './Screens/QrCodeFunctionality'; // Import QrCodeFunctionality

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  NfcFunctionality: undefined;
  QrCodeFunctionality: undefined; // Add QrCodeFunctionality to the navigation stack
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
          name="QrCodeFunctionality" // Add the QrCodeFunctionality screen to the navigator
          component={QrCodeFunctionality}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
