import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../ThemeContext'; // Import the theme context
import tw from 'twrnc';

const transactions = [
  { id: 1, description: 'Grocery Store', amount: '-$50.00' },
  { id: 2, description: 'Salary', amount: '+$2,000.00' },
  { id: 3, description: 'Coffee Shop', amount: '-$5.00' },
];

const RecentTransactions = () => {
  const { theme } = useTheme(); // Use the theme context

  const backgroundColor = theme === 'light' ? '#f0f8ff' : '#333';
  const shadowColor = theme === 'light' ? '#000' : 'transparent'; // Hide shadow in dark mode
  const textColor = theme === 'light' ? '#888' : '#ccc';
  const amountColor = '#1E90FF';

  const containerStyle = [
    tw`my-5 p-5 rounded-lg shadow-lg w-full`,
    { backgroundColor, shadowColor },
  ];
  const titleStyle = [tw`text-lg font-bold mb-2`, { color: textColor }];
  const descriptionStyle = [tw`text-base`, { color: textColor }];
  const amountStyle = [tw`text-base`, { color: amountColor }];

  return (
    <View style={tw`flex-1 items-center justify-center w-full`}>
      <View style={containerStyle}>
        <Text style={titleStyle}>Recent Transactions</Text>
        {transactions.map(transaction => (
          <View key={transaction.id} style={tw`flex-row justify-between py-2 border-b border-gray-300`}>
            <Text style={descriptionStyle}>{transaction.description}</Text>
            <Text style={amountStyle}>{transaction.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecentTransactions;
