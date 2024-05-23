// FUSE-EXPO/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import MyExpenses from './Screens/MyExpenses'; // Import MyExpenses
import MakeTransaction from './Screens/MakeTransaction'; // Import MakeTransaction
import Profile from './Screens/profile';
import MyCard from './Screens/MyCards';
import TransactionHistory from './Screens/TransactionHistory'; // Import TransactionHistory

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  MyExpenses: undefined; // Add MyExpenses to the navigation stack
  MakeTransaction: undefined; // Add MakeTransaction to the navigation stack
  Profile: undefined;
  MyCard: undefined;
  TransactionHistory: undefined; // Add TransactionHistory to the navigation stack
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS, // Apply the transition preset
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="MyExpenses" // Add the MyExpenses screen to the navigator
          component={MyExpenses}
        />
        <Stack.Screen
          name="MakeTransaction" // Add the MakeTransaction screen to the navigator
          component={MakeTransaction}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          name="MyCard"
          component={MyCard}
        />
        <Stack.Screen
          name="TransactionHistory" // Add the TransactionHistory screen to the navigator
          component={TransactionHistory}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
