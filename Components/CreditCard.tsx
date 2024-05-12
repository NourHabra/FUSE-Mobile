import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useTheme } from '../ThemeContext'; // Adjust the import path to where your ThemeContext is defined

const CreditCard = () => {
  const { theme } = useTheme(); // Using the theme from ThemeContext using useTheme hook

  // Determine the source of the image based on the theme
  const imageSource = theme === 'dark' ? require('../assets/10.png') : require('../assets/09.png');

  return (
    <View style={styles.cardContainer}>
      <ImageBackground 
        source={imageSource}
        style={styles.card}
        resizeMode="cover" // This prop ensures the image covers the entire background
      >
        <Text style={styles.cardText}>John Doe</Text>
        <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
        <Text style={styles.cardText}>Expires 12/25</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 300,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cardNumber: {
    fontSize: 21,
    letterSpacing: 2,
    marginVertical: 15,
  },
});

export default CreditCard;
