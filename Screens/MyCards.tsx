import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';

const MyCards: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();

  // Define the background color for light and dark themes
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? 'text-[#1F1F1F]' : 'text-white';

  return (
    <View style={[tw`flex-1 justify-center items-center`, { backgroundColor }]}>
      <Text style={tw`${textColor} text-2xl font-bold`}>My Card</Text>
    </View>
  );
};

export default MyCards;
