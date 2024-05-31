import React, { useEffect } from 'react';
import { View, Text, BackHandler, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import Beneficiaries from '../Components/Beneficiaries'; // Import the new component
import Icon from 'react-native-vector-icons/Feather';
import AccountCard from '../Components/AccountCard';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';


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
  const iconColorClass = theme === 'light' ? 'black' : 'black';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-2`}>
        <Text style={tw`${textColorClass} text-2xl font-bold ml-4 mt-5`}>Welcome, John!</Text>
        <ScrollView contentContainerStyle={tw`flex-grow items-center justify-start`}>
          <AccountCard />
          {/* Quick Actions */}
          <View style={tw`w-full flex-col items-center my-4`}>
            <Text style={tw`${textColorClass} text-2xl font-bold pb-2`}>
              Quick Actions
            </Text>
            <View style={tw`w-full flex-row justify-evenly`}>
              <TouchableOpacity onPress={() => navigation.navigate("Pay")} style={tw`w-1/4 justify-center items-center bg-gray-400 py-5 rounded-3xl`}>
                <Icon name="credit-card" size={40} color={iconColorClass} style={tw`pb-2`} />
                <Text style={[tw`text-2xl font-bold`, { color: iconColorClass }]}>Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Send")} style={tw`w-1/4 justify-center items-center bg-gray-400 py-5 rounded-3xl`}>
                <Icon name="send" size={40} color={iconColorClass} style={tw`pb-2`} />
                <Text style={[tw`text-2xl font-bold`, { color: iconColorClass }]}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Receive")} style={tw`w-1/4 justify-center items-center bg-gray-400 py-5 rounded-3xl`}>
                <Icon name="inbox" size={40} color={iconColorClass} style={tw`pb-2`} />
                <Text style={[tw`text-2xl font-bold`, { color: iconColorClass }]}>Receive</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <Beneficiaries /> */}
        </ScrollView>
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default Home;
