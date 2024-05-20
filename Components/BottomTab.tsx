import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { useTheme } from '../ThemeContext';
import { useRoute } from '@react-navigation/native';

interface BottomTabProps {
  navigation: any;
}

const BottomTab: React.FC<BottomTabProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const route = useRoute();

  const handlePress = (screen: string) => {
    navigation.navigate(screen);
  };

  // Update the background color to match the Home screen's background gray color
  const backgroundColor = theme === 'light' ? '#F0F0F0' : '#404040'; // Use the same gray color as in Home screen
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-300';
  const iconColor = theme === 'light' ? 'text-gray-800' : 'text-gray-300';
  const shadowColor = theme === 'light' ? '#000' : 'transparent'; // Hide shadow in dark mode

  const getTabStyle = (screen: string) => {
    const isActive = route.name === screen;
    return isActive ? tw`text-blue-500` : tw`${iconColor}`;
  };

  return (
    <View style={[tw`flex-row justify-around items-center h-16 w-11/12 rounded-2xl self-center mb-6 shadow-md`, { backgroundColor, shadowColor, shadowOpacity: 0.15, shadowRadius: 8 }]}>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('MyCard')}>
        <Ionicons name="card-outline" size={28} style={getTabStyle('MyCard')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>My Card</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('NfcFunctionality')}>
        <Ionicons name="wifi-outline" size={28} style={getTabStyle('NfcFunctionality')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>NFC</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('Home')}>
        <Ionicons name="home-outline" size={28} style={getTabStyle('Home')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('QrCodeFunctionality')}>
        <Ionicons name="qr-code-outline" size={28} style={getTabStyle('QrCodeFunctionality')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('Profile')}>
        <Ionicons name="person-outline" size={28} style={getTabStyle('Profile')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTab;
