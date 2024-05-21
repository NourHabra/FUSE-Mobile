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

  const backgroundColor = theme === 'light' ? '#F0F0F0' : '#404040';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-300';
  const iconColor = theme === 'light' ? 'text-gray-800' : 'text-gray-300';
  const shadowColor = theme === 'light' ? '#000' : 'transparent';

  const getTabStyle = (screen: string) => {
    const isActive = route.name === screen;
    return isActive ? { color: '#94B9C5' } : tw`${iconColor}`;
  };

  return (
    <View style={[tw`flex-row justify-around items-center h-16 w-11/12 rounded-2xl self-center mb-6 shadow-md`, { backgroundColor, shadowColor, shadowOpacity: 0.15, shadowRadius: 8 }]}>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('MyCard')}>
        <Ionicons name="card-outline" size={28} style={getTabStyle('MyCard')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>My Card</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('MyExpenses')}>
        <Ionicons name="wallet-outline" size={28} style={getTabStyle('MyExpenses')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>Expenses</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('Home')}>
        <Ionicons name="home-outline" size={28} style={getTabStyle('Home')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('MakeTransaction')}>
        <Ionicons name="swap-horizontal-outline" size={28} style={getTabStyle('MakeTransaction')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`items-center justify-center p-2`} onPress={() => handlePress('Profile')}>
        <Ionicons name="person-outline" size={28} style={getTabStyle('Profile')} />
        <Text style={tw`mt-1 ${textColor} text-xs font-semibold`}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(BottomTab);
