import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useTheme } from '../ThemeContext'; // Adjust the import path to where your ThemeContext is defined
import tw from 'twrnc';


const CreditCard = () => {
  return (
    <View style={tw`h-48 w-full bg-white rounded-xl my-1 py-2 px-4 flex-col justify-between`}>
      <Text style={tw`text-base`}>Card 1 Name</Text>
      <Text style={tw`text-2xl tracking-widest w-full text-center mt-4`}>0000 0000 0000 0000</Text>
      <View style={tw`flex-row justify-between items-center w-full`}>
        <View>
          <Text style={tw`text-sm`}>Balance</Text>
          <View style={tw`flex-row justify-start items-center`}>
            <Text style={tw`text-xl tracking-wide`}>SYP</Text>
            <Text style={tw`text-xl tracking-wide pl-1`}>15,000</Text>
          </View>
        </View>
        <View>
          <Text style={tw`text-sm`}>Expiry</Text>
          <Text style={tw`text-xl tracking-wide`}>25/09</Text>
        </View>
      </View>
    </View>
  );
};

export default CreditCard;
