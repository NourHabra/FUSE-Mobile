import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const PromotionalBanner = () => {
  const { theme } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme === 'light' ? '#FFD700' : '#555', shadowColor: theme === 'light' ? '#000' : '#fff' },
  ];
  const messageStyle = [styles.message, { color: theme === 'light' ? '#000' : '#fff' }];

  return (
    <View style={containerStyle}>
      <Text style={messageStyle}>Get 10% cashback on all purchases this month!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PromotionalBanner;
