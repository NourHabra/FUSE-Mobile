import React, { useEffect, useState } from 'react';
import { View, Text, BackHandler, ScrollView, StatusBar, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import AccountCard from '../Components/AccountCard';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axios from 'axios';
import baseUrl from "../baseURL"
import { decryptData } from '../crypto-utils';


const Home = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMerchant, setIsMerchant] = useState(true);

  const [cards, setCards] = useState([]);


  const jwt = useSelector((state: RootState) => state.auth.jwt);
  const aesKey = useSelector((state: RootState) => state.auth.aesKey);
  const role = useSelector((state: RootState) => state.auth.role);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${baseUrl}/account/user`, { jwt });
        const decryptedPayload = decryptData(response.data.payload, aesKey);
        // console.log('Accounts:', decryptedPayload);
        setCards(decryptedPayload);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleBackButtonPress = () => {
    const navigationState = navigation.getState();
    const currentRouteName = navigationState.routes[navigationState.index].name;

    if (currentRouteName === 'Home') {
      return true;
    }

    return false;
  };

  // Define the background color for light and dark themes
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030'; // Custom very dark blue
  const textColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const iconColorClass = theme === 'light' ? 'black' : 'white';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

  // Sample data for cards
  // const cards = [
  //   { id: '1', type: 'Checking', balance: '$10,546.70' },
  //   { id: '2', type: 'Savings', balance: '$5,123.45' },
  //   { id: '3', type: 'Business', balance: '$20,789.00' },
  // ];

  const cardWidth = Dimensions.get('window').width * 0.85;
  const cardSpacing = 10; // Adjust this value to control spacing between cards

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + cardSpacing));
    setCurrentIndex(index);
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-2`}>
        <Text style={tw`${textColorClass} text-2xl font-bold mb-2 ml-4 mt-5`}>Welcome, {user?.name}</Text>
        <ScrollView contentContainerStyle={tw`flex-grow items-center justify-start`}>
          <View style={tw`w-full items-center`}>
            <FlatList
              data={cards}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ width: cardWidth, marginHorizontal: cardSpacing / 2 }}>
                  <AccountCard type={item.type} balance={item.balance} />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + cardSpacing}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: cardSpacing / 2 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
            <View style={tw`flex-row justify-center mt-4`}>
              {cards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    tw`h-2 w-2 rounded-full mx-1`,
                    {
                      backgroundColor: currentIndex === index ? '#32CD32' : '#D3D3D3', // Lime green for active dot, light gray for inactive dots
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={tw`w-full flex-col items-center my-4`}>
            <View style={tw`w-full flex-row justify-evenly`}>
              <TouchableOpacity onPress={() => navigation.navigate("Pay")} style={tw`w-1/4 justify-center items-center bg-blue-500 py-3 rounded-lg shadow-md`}>
                <Icon name="credit-card" size={32} color={iconColorClass} style={tw`pb-2`} />
                <Text style={[tw`text-lg font-semibold`, { color: iconColorClass }]}>Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Send")} style={tw`w-1/4 justify-center items-center bg-green-500 py-3 rounded-lg shadow-md`}>
                <Icon name="send" size={32} color={iconColorClass} style={tw`pb-2`} />
                <Text style={[tw`text-lg font-semibold`, { color: iconColorClass }]}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Receive")} style={tw`w-1/4 justify-center items-center bg-purple-500 py-3 rounded-lg shadow-md`}>
                <Icon name="inbox" size={32} color={iconColorClass} style={tw`pb-2`} />
                <Text style={[tw`text-lg font-semibold`, { color: iconColorClass }]}>Receive</Text>
              </TouchableOpacity>
            </View>
            {isMerchant &&
              <View style={tw`w-full flex-row justify-evenly mt-4`}>
                <TouchableOpacity onPress={() => navigation.navigate("IssueBill")} style={tw`w-2/3 justify-center items-center bg-purple-500 py-3 rounded-lg shadow-md`}>
                  <Icon name="edit" size={32} color={iconColorClass} style={tw`pb-2`} />
                  <Text style={[tw`text-lg font-semibold`, { color: iconColorClass }]}>Issue Bill</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
          {/* <Beneficiaries /> */}
        </ScrollView>
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default Home;
