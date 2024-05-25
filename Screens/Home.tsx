import React, { useEffect } from 'react';
import { View, Text, BackHandler, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import CreditCard from '../Components/CreditCard';
import BalanceDisplay from '../Components/BalanceDisplay';
import Beneficiaries from '../Components/Beneficiaries'; // Import the new component
import Icon from 'react-native-vector-icons/Feather';


const Home = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleBackButtonPress = () => {
    const navigationState = navigation.getState();
    const currentRouteName = navigationState.routes[navigationState.index].name;

    if (currentRouteName === 'Home') {
      return true;
    }

    return false;
  };

  // Define the background color for light and dark themes
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030'; // Custom very dark blue
  const textColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const iconColorClass = theme === 'light' ? 'black' : 'white';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`${textColorClass} text-2xl font-bold mb-4`}>Welcome, John!</Text>
        <ScrollView contentContainerStyle={tw`flex-grow items-center justify-center p-5`}>
          <CreditCard />
          <View style={tw`w-full flex-row justify-between`}>
            <BalanceDisplay />
          </View>
          <View style={tw`w-full flex-row justify-center py-5`}>
            <TouchableOpacity onPress={() => navigation.navigate("MakeTransaction")} style={tw`w-1/2 justify-center items-center bg-gray-400	mx-1 py-5 rounded-3xl`}>
              <Icon name="send" size={40} color={iconColorClass} style={tw`pb-2`} />
              <Text style={tw`${textColorClass} text-2xl font-bold`}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("MakeTransaction")} style={tw`w-1/2 justify-center items-center bg-gray-400	mx-1 py-5 rounded-3xl`}>
              <Icon name="inbox" size={40} color={iconColorClass} style={tw`pb-2`} />
              <Text style={tw`${textColorClass} text-2xl font-bold`}>Recieve</Text>
            </TouchableOpacity>
          </View>
          <Beneficiaries />
        </ScrollView>
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default Home;
