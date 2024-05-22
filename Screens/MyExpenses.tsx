import React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import tw from 'twrnc';
import { useTheme } from '../ThemeContext';
import BottomTab from '../Components/BottomTab';
import ExpenseGraph from '../Components/ExpenseGraph';

const dummyExpenses = [
  { id: '1', category: 'Food', amount: 50 },
  { id: '2', category: 'Transport', amount: 20 },
  { id: '3', category: 'Entertainment', amount: 100 },
  { id: '4', category: 'Utilities', amount: 75 },
];

const expenseData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [50, 20, 100, 75, 30, 90],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
};

const MyExpenses: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#333333' : '#DDDDDD'; // More vibrant text color
  const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
  const amountColor = theme === 'light' ? '#181E20' : '#94B9C5';

  const titleStyle = [tw`text-2xl font-bold mb-4`, { color: textColor }];
  const suggestionTitleStyle = [tw`text-lg font-bold mb-1`, { color: textColor }];
  const suggestionTextStyle = [tw`text-sm`, { color: textColor }];
  const expenseItemStyle = [tw`text-lg`, { color: textColor }];
  const expenseAmountStyle = [tw`text-lg font-bold`, { color: amountColor }];

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-4`}>
        <Text style={titleStyle}>My Expenses</Text>
        <View style={[tw`rounded-lg p-3 mb-4`, { backgroundColor: cardBackgroundColor }]}>
          <Text style={suggestionTitleStyle}>Budgeting Suggestion</Text>
          <Text style={suggestionTextStyle}>
            To reach your goal of saving $500 this month, consider reducing your entertainment expenses by 20% and increasing your savings by 10%.
          </Text>
        </View>
        <View style={tw`mr-20`}>
          <ExpenseGraph data={expenseData} />
        </View>
        <View style={[tw`rounded-lg p-3`, { backgroundColor: cardBackgroundColor }]}>
          <Text style={suggestionTitleStyle}>Expense Items</Text>
          <FlatList
            data={dummyExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`flex-row justify-between mb-1`}>
                <Text style={expenseItemStyle}>{item.category}</Text>
                <Text style={expenseAmountStyle}>${item.amount}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default MyExpenses;
