import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';

const BalanceDisplay = () => {
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#f0f8ff' : '#333';
  const shadowColor = theme === 'light' ? '#000' : 'transparent'; // Hide shadow in dark mode
  const labelColor = theme === 'light' ? '#888' : '#ccc';
  const balanceColor = '#ADD8E6'; // Updated color

  const containerStyle = [
    tw`flex items-center justify-center my-5 mx-1.5 p-5 rounded-lg shadow-lg w-11/12`,
    { backgroundColor, shadowColor },
  ];
  const labelStyle = [tw`text-lg mb-2`, { color: labelColor }];
  const balanceStyle = [tw`text-2xl font-bold`, { color: balanceColor }];

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <View style={containerStyle}>
        <Text style={labelStyle}>Current Balance</Text>
        <Text style={balanceStyle}>$1,234.56</Text>
      </View>
    </View>
  );
};

export default BalanceDisplay;
