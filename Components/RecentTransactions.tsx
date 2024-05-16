import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const transactions = [
  { id: 1, description: 'Grocery Store', amount: '-$50.00' },
  { id: 2, description: 'Salary', amount: '+$2,000.00' },
  { id: 3, description: 'Coffee Shop', amount: '-$5.00' },
];

const RecentTransactions = () => {
  const { theme } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme === 'light' ? '#f0f8ff' : '#444', shadowColor: theme === 'light' ? '#000' : '#fff' },
  ];
  const titleStyle = [styles.title, { color: theme === 'light' ? '#000' : '#fff' }];
  const descriptionStyle = [styles.description, { color: theme === 'light' ? '#000' : '#ccc' }];
  const amountStyle = [styles.amount, { color: theme === 'light' ? '#1E90FF' : '#1E90FF' }];

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Recent Transactions</Text>
      {transactions.map(transaction => (
        <View key={transaction.id} style={styles.transaction}>
          <Text style={descriptionStyle}>{transaction.description}</Text>
          <Text style={amountStyle}>{transaction.amount}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  description: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
  },
});

export default RecentTransactions;
