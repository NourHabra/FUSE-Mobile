import React, { useEffect } from 'react';
import { View, Text, BackHandler, ScrollView, StatusBar } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import CreditCard from '../Components/CreditCard';
import BalanceDisplay from '../Components/BalanceDisplay';
import RecentTransactions from '../Components/RecentTransactions';
import PromotionalBanner from '../Components/PromotionalBanner';

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
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <ScrollView contentContainerStyle={tw`flex-grow items-center justify-center p-5`}>
        <CreditCard />
        <View style={tw`w-full flex-row justify-between`}>
          <BalanceDisplay />
        </View>
        <PromotionalBanner />
        <RecentTransactions />
      </ScrollView>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default Home;
