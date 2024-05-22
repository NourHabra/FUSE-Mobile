import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';

const BalanceDisplay = () => {
  const { theme } = useTheme();

  // Set the color based on the theme
  const balanceColor = theme === 'light' ? '#181E20' : '#94B9C5';

  const balanceStyle = [tw`text-6xl font-bold mt-10`, { color: balanceColor }];

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={balanceStyle}>$1,234.56</Text>
    </View>
  );
};

export default BalanceDisplay;
