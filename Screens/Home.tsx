import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import CreditCard from '../Components/CreditCard';

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
    // <View style={[styles.container, { backgroundColor }]}>
    //   <View style={styles.content}>
    //       <CreditCard />
    //   </View>
    //   <BottomTab navigation={navigation} />
    // </View>
    <View style={styles.page}>
      <CreditCard />
      <BottomTab navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    height: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "red",
  },
});

export default Home;
