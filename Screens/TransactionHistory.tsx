// @FUSE-EXPO/Screens/TransactionHistory.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTab from '../Components/BottomTab';

const transactions = [
  // Sample data
  { id: '1', type: 'send', amount: '100', date: '2023-01-01' },
  { id: '2', type: 'request', amount: '200', date: '2023-01-02' },
  // Add more transactions here
];

const TransactionHistory: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'send' | 'request'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.amount.includes(search) || transaction.date.includes(search);
    const matchesFilter = filter === 'all' || transaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#333333' : '#DDDDDD';
  const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
  const buttonBackgroundColor = theme === 'light' ? '#181E20' : '#94B9C5';
  const backButtonColor = theme === 'light' ? '#181E20' : '#94B9C5';
  const selectedButtonColor = theme === 'light' ? '#028174' : '#94B9C5'; // Blue color for light mode

  const titleStyle = [tw`text-2xl font-bold ml-2`, { color: textColor }];
  const filterButtonStyle = [tw`p-2 rounded-lg mx-1`, { backgroundColor: buttonBackgroundColor }];
  const filterButtonIconColor = theme === 'light' ? '#FFFFFF' : '#000000';

  const CustomButton = ({ iconName, onPress, isActive }: { iconName: string, onPress: () => void, isActive: boolean }) => (
    <TouchableOpacity
      style={[filterButtonStyle, { backgroundColor: isActive ? selectedButtonColor : buttonBackgroundColor }]}
      onPress={onPress}
    >
      <Icon name={iconName} size={28} color={isActive ? '#FFFFFF' : filterButtonIconColor} />
    </TouchableOpacity>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-5`}>
        <View style={tw`flex-row items-center mb-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
            <Icon name="arrow-back" size={28} color={backButtonColor} />
          </TouchableOpacity>
          <Text style={titleStyle}>Transaction History</Text>
        </View>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <TextInput
            style={[tw`flex-1 p-2 rounded-lg`, { backgroundColor: cardBackgroundColor, color: textColor }]}
            placeholder="Search"
            placeholderTextColor={theme === 'light' ? '#888' : '#aaa'}
            value={search}
            onChangeText={setSearch}
          />
          <CustomButton iconName="list" onPress={() => setFilter('all')} isActive={filter === 'all'} />
          <CustomButton iconName="send" onPress={() => setFilter('send')} isActive={filter === 'send'} />
          <CustomButton iconName="request-page" onPress={() => setFilter('request')} isActive={filter === 'request'} />
        </View>
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[tw`p-4 mb-2 rounded-lg`, { backgroundColor: cardBackgroundColor }]}>
              <Text style={[tw`text-lg`, { color: textColor }]}>Type: {item.type}</Text>
              <Text style={[tw`text-lg`, { color: textColor }]}>Amount: {item.amount}</Text>
              <Text style={[tw`text-lg`, { color: textColor }]}>Date: {item.date}</Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme === 'light' ? 'black' : 'white']}
              tintColor={theme === 'light' ? 'black' : 'white'}
            />
          }
        />
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default TransactionHistory;
