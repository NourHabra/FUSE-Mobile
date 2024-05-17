import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const BalanceDisplay = () => {
  const { theme } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme === 'light' ? '#f0f8ff' : '#444', shadowColor: theme === 'light' ? '#000' : '#fff' },
  ];
  const labelStyle = [styles.label, { color: theme === 'light' ? '#888' : '#ccc' }];
  const balanceStyle = [styles.balance, { color: theme === 'light' ? '#1E90FF' : '#1E90FF' }];

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>Current Balance</Text>
      <Text style={balanceStyle}>$1,234.56</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "45%",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BalanceDisplay;
