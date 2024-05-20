import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../ThemeContext';
import BottomTab from '../Components/BottomTab';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import tw from 'twrnc'; // Import twrnc

// Type the navigation prop
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>(); // Use the navigation prop

  // Define the background color for light and dark themes
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030'; // Custom very dark blue
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const borderColor = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

  // Function to handle logout
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <ScrollView contentContainerStyle={tw`flex-grow items-center p-3`}>
        <View style={tw`items-center mb-4`}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={tw`w-20 h-20 rounded-full mb-2`}
          />
          <Text style={tw`text-2xl font-bold ${textColor}`}>John Doe</Text>
          <Text style={tw`text-lg text-gray-500`}>johndoe@example.com</Text>
        </View>
        <View style={tw`w-full mb-4 p-4 rounded-lg border ${borderColor}`}>
          <Text style={tw`text-xl font-bold mb-2 ${textColor}`}>Account</Text>
          <TouchableOpacity style={tw`py-2`}>
            <Text style={tw`text-lg ${textColor}`}>Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`py-2`}>
            <Text style={tw`text-lg ${textColor}`}>Change Password</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`w-full mb-4 p-4 rounded-lg border ${borderColor}`}>
          <Text style={tw`text-xl font-bold mb-2 ${textColor}`}>Settings</Text>
          <TouchableOpacity style={tw`py-2`}>
            <Text style={tw`text-lg ${textColor}`}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`py-2`}>
            <Text style={tw`text-lg ${textColor}`}>Privacy</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`w-full mb-4 p-4`}>
          <TouchableOpacity style={tw`bg-red-600 py-3 items-center`} onPress={handleLogout}>
            <Text style={tw`text-white text-lg font-bold`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default Profile;
