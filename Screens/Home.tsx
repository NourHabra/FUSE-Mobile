import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ScrollView } from 'react-native';
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

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <CreditCard />
        <BalanceDisplay />
        <PromotionalBanner />
        <RecentTransactions />
      </ScrollView>
      <BottomTab navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default Home;
