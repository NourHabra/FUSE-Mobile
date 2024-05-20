import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useTheme } from '../ThemeContext'; // Adjust the import path to where your ThemeContext is defined
import * as Font from 'expo-font';

const CreditCard = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        // Don't include spaces in the path
        // KodeMono: require("../assets/fonts/KodeMono.ttf"),
        SometypeMono: require("../assets/fonts/SometypeMono.ttf"),
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
  const textColor = theme === 'dark' ? '#000000' : '#FFFFFF'; // Set text color based on the theme

  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={imageSource}
        style={styles.card}
        resizeMode="cover" // This prop ensures the image covers the entire background
      >
        <Image source={require('../assets/credit-card-chip.png')} style={styles.chip} />
        {fontsLoaded && (
          <Text style={[styles.cardNumber, { color: textColor }]}>1234 5678 9012 3456</Text>
        )}
        <View style={styles.flexRow}>
          <Text style={[styles.cardText, { color: textColor }]}>Nour Habra</Text>
          <View style={styles.expirationText}>
            <Text style={[styles.smallLabel, { color: textColor }]}>EXP</Text>
            <Text style={[styles.cardText, { color: textColor }]}>12/25</Text>
          </View>
          <View></View>
        </View>
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
  chip: {
    height: "50%",
    color: "black",
    width: "50%",
    marginBottom: -100,
  },
  cardText: {
    fontSize: 18,
    letterSpacing: 2,
    marginVertical: 15,
  },
  cardNumber: {
    fontFamily: "SometypeMono",
    fontSize: 24,
    letterSpacing: 1,
    marginTop: 100
  },
  flexRow: {
    flexDirection: "row",
    width: "80%",
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  expirationText: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallLabel: {
    fontSize: 12,
    marginRight: 2
  },
});

export default CreditCard;
