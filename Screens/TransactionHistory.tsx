import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [loading, setLoading] = useState(false);

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
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';
  const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
  const buttonColor = theme === 'light' ? '#028174' : '#92DE8B';
  const buttonTextColor = theme === 'light' ? '#FFFFFF' : '#181E20';
  const placeholderColor = theme === 'light' ? '#999999' : '#A0A0A0';

  const titleStyle = [tw`text-2xl font-bold ml-2`, { color: textColor }];
  const filterButtonStyle = [tw`p-2 rounded-lg mx-1`, { backgroundColor: buttonColor }];

  const CustomButton = ({ iconName, onPress, isActive }: { iconName: string, onPress: () => void, isActive: boolean }) => (
    <TouchableOpacity
      style={[filterButtonStyle, { opacity: isActive ? 1 : 0.7 }]}
      onPress={onPress}
    >
      <Icon name={iconName} size={24} color={buttonTextColor} />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[tw`flex-1`, { backgroundColor }]}>
        <StatusBar backgroundColor={backgroundColor} barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
        <View style={tw`flex-1 p-5`}>
          <View style={tw`flex-row items-center mb-4`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
              <Icon name="arrow-left" size={28} color={textColor} />
            </TouchableOpacity>
            <Text style={titleStyle}>Transaction History</Text>
          </View>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TextInput
              style={[tw`flex-1 p-3 rounded-lg mr-2`, { backgroundColor: cardBackgroundColor, color: textColor }]}
              placeholder="Search"
              placeholderTextColor={placeholderColor}
              value={search}
              onChangeText={setSearch}
            />
            <CustomButton iconName="format-list-bulleted" onPress={() => setFilter('all')} isActive={filter === 'all'} />
            <CustomButton iconName="send" onPress={() => setFilter('send')} isActive={filter === 'send'} />
            <CustomButton iconName="cash-multiple" onPress={() => setFilter('request')} isActive={filter === 'request'} />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={buttonColor} />
          ) : (
            <FlatList
              data={filteredTransactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[tw`p-4 mb-2 rounded-lg`, { backgroundColor: cardBackgroundColor }]}>
                  <Text style={[tw`text-lg font-bold`, { color: textColor }]}>{item.type === 'send' ? 'Sent' : 'Received'}</Text>
                  <Text style={[tw`text-lg`, { color: textColor }]}>Amount: ${item.amount}</Text>
                  <Text style={[tw`text-sm`, { color: placeholderColor }]}>Date: {item.date}</Text>
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[buttonColor]}
                  tintColor={buttonColor}
                />
              }
            />
          )}
        </View>
        <BottomTab navigation={navigation} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionHistory;
