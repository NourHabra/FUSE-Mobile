import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useTheme } from '../ThemeContext'; // Adjust the import path to where your ThemeContext is defined
import tw from 'twrnc';

const CreditCard = ({ id, name, balance, cvv, expiry }: { id: string, name: string, balance: number, cvv: number, expiry: string }) => {
  return (
    <View style={tw`h-48 w-full bg-white rounded-xl my-1 py-2 px-4 flex-col justify-between`}>
      <Text style={tw`text-base`}>{name}</Text>
      <View style={tw`mt-4`}>
        <Text style={tw`text-2xl tracking-widest w-full text-center font-bold`}>{id.replace(/(.{4})/g, '$1  ').trim()}</Text>
      </View>
      <View style={tw`flex-row justify-between items-center w-full`}>
        <View>
          <Text style={tw`text-sm`}>Balance</Text>
          <View style={tw`flex-row justify-start items-center`}>
            <Text style={tw`text-sm tracking-wide`}>SYP</Text>
            <Text style={tw`text-xl tracking-wide pl-1`}>{balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
          </View>
        </View>
        <View>
          <Text style={tw`text-sm`}>Expiry</Text>
          <Text style={tw`text-xl tracking-wide`}>{new Date(expiry).getMonth() + 1}/{new Date(expiry).getFullYear()}</Text>
        </View>
        <View>
          <Text style={tw`text-sm`}>CVV</Text>
          <Text style={tw`text-xl tracking-wide`}>{cvv}</Text>
        </View>
      </View>
    </View>
  );
}
export default CreditCard;
