import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import BottomTab from '../Components/BottomTab';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axios from 'axios';
import baseUrl from '../baseUrl';
import { decryptData, encryptData } from '../crypto-utils';
const transactions = [
  // Sample data
  { id: '1', type: 'send', amount: '100', date: '2023-01-01' },
  { id: '2', type: 'request', amount: '200', date: '2023-01-02' },
  // Add more transactions here
];

const TransactionHistory: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const primaryColor = theme === 'light' ? '#006e63' : '#65e991';

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'send' | 'request'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const jwt = useSelector((state: RootState) => state.auth.jwt);
  const aesKey = useSelector((state: RootState) => state.auth.aesKey);

  const [bills, setBills] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);

  const [sent, setSent] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [sends, setSends] = useState<any[]>([]);


  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.post(`${baseUrl}/user/received`, { jwt });
        const decryptedPayload = decryptData(response.data.payload, aesKey);
        const response2 = await axios.post(`${baseUrl}/user/sent`, { jwt });
        const decryptedPayload2 = decryptData(response2.data.payload, aesKey);

        console.log("Incoming");
        console.log(decryptedPayload.recived);
        console.log("Outgoing");
        console.log(decryptedPayload2.sent);

        setBills(decryptedPayload.recived.bills);
        setDeposits(decryptedPayload.recived.deposits);
        setTransfers(decryptedPayload.recived.transfer);

        setSent(decryptedPayload2.sent)
        setPayments(decryptedPayload2.sent.bills)
        setSends(decryptedPayload2.sent.transfers)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCards();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.amount?.includes(search) || transaction.date?.includes(search);
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
  const buttonColor = theme === 'light' ? '#028174' : '#65e991';
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
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center mb-4 p-5`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
              <Icon name="arrow-left" size={28} color={textColor} />
            </TouchableOpacity>
            <Text style={titleStyle}>Transaction History</Text>
          </View>
          <ScrollView
            style={tw``}
          >
            {transfers && transfers.map((transfer, index) => (
              <View key={index} style={[tw`flex-row items-center justify-start mx-2 my-0.5 py-2 px-4 border rounded-2xl`, { borderColor: primaryColor }]}>
                <Icon name="arrow-down" size={25} color={primaryColor} />
                <View style={tw`w-grow ml-4`}>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{new Date(transfer.createdAt).toDateString()} - Transfer</Text>
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>Transfer</Text> */}
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>ID: {transfer.id}</Text> */}
                  <Text style={[tw`text-xl font-bold`, { color: textColor }]}>{transfer.sAccount.user.name}</Text>
                </View>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>${transfer.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                {/* <Text style={titleStyle}>Date: {transfer.date}</Text> */}
              </View>
            ))}
            {bills && bills.map((bill, index) => (
              <View key={index} style={[tw`flex-row items-center justify-start mx-2 my-0.5 py-2 px-4 border rounded-2xl`, { borderColor: primaryColor }]}>
                <Icon name="arrow-down" size={25} color={primaryColor} />
                <View style={tw`w-grow ml-4`}>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{new Date(bill.payedAt).toDateString()} - Payment</Text>
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>bill</Text> */}
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>ID: {bill.id}</Text> */}
                  <Text style={[tw`text-xl font-bold`, { color: textColor }]}>{bill.card.account.user.name}</Text>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{bill.details != "" ? bill.details : "No details available"}</Text>
                </View>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>${bill.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                {/* <Text style={titleStyle}>Date: {bill.date}</Text> */}
              </View>
            ))}
            {deposits && deposits.map((cashTransaction, index) => (
              <View key={index} style={[tw`flex-row items-center justify-start mx-2 my-0.5 py-2 px-4 border rounded-2xl`, { borderColor: primaryColor }]}>
                <Icon name="arrow-down" size={25} color={primaryColor} />
                <View style={tw`w-grow ml-4`}>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{new Date(cashTransaction.payedAt).toDateString()} - Payment</Text>
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>cashTransaction</Text> */}
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>ID: {cashTransaction.id}</Text> */}
                  <Text style={[tw`text-xl font-bold`, { color: textColor }]}>{cashTransaction.card.account.user.name}</Text>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{cashTransaction.details}</Text>
                </View>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>${cashTransaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                {/* <Text style={titleStyle}>Date: {cashTransaction.date}</Text> */}
              </View>
            ))}

            {/* Outgoing */}
            {payments && payments.map((payment, index) => (
              <View key={index} style={[tw`flex-row items-center justify-start mx-2 my-0.5 py-2 px-4 border rounded-2xl`, { borderColor: primaryColor }]}>
                <Icon name="arrow-up" size={25} color={"red"} />
                <View style={tw`w-grow ml-4`}>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{new Date(payment.payedAt).toDateString()} - Payment</Text>
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>payment</Text> */}
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>ID: {payment.id}</Text> */}
                  <Text style={[tw`text-xl font-bold`, { color: textColor }]}>{payment.merchantAccount.user.merchant.Category.name}</Text>
                  <Text style={[tw`text-base font-bold`, { color: textColor }]}>{payment.merchantAccount.user.name}</Text>
                  {/* <Text style={[tw`text-xs`, { color: textColor }]}>{payment.details}</Text> */}
                </View>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>${payment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                {/* <Text style={titleStyle}>Date: {payment.date}</Text> */}
              </View>
            ))}
            {sends && sends.map((transfer, index) => (
              <View key={index} style={[tw`flex-row items-center justify-start mx-2 my-0.5 py-2 px-4 border rounded-2xl`, { borderColor: primaryColor }]}>
                <Icon name="arrow-down" size={25} color={primaryColor} />
                <View style={tw`w-grow ml-4`}>
                  <Text style={[tw`text-xs`, { color: textColor }]}>{new Date(transfer.createdAt).toDateString()} - Transfer</Text>
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>Transfer</Text> */}
                  {/* <Text style={[tw`text-base`, { color: textColor }]}>ID: {transfer.id}</Text> */}
                  <Text style={[tw`text-xl font-bold`, { color: textColor }]}>{transfer.dAccount.user.name}</Text>
                </View>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>${transfer.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                {/* <Text style={titleStyle}>Date: {transfer.date}</Text> */}
              </View>
            ))}
          </ScrollView>
        </View>

        <BottomTab navigation={navigation} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionHistory;
