import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useTheme } from '../ThemeContext'; // Adjust the import path to where your ThemeContext is defined
import App from '../App';
import * as Font from 'expo-font';

const CreditCard = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        // Don't include spaces in the path
        KodeMono: require("../assets/fonts/KodeMono.ttf"),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error("Font loading error:", error);
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

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
        <Text style={styles.cardText}>Nour Habra</Text>
        {fontsLoaded && (
          <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
        )}
        <Text style={styles.cardText}>12/25</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "30%",
    padding: "4%"
  },
  card: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardText: {
    fontSize: 18,
    letterSpacing: 2,
    marginVertical: 15,
  },
  cardNumber: {
    fontFamily: "KodeMono",
    fontSize: 24,
    letterSpacing: 3,
  },
});

export default CreditCard;
