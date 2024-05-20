import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import CreditCard from '../Components/CreditCard';

const { width } = Dimensions.get('window');

const MyCards: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();

  // Define the background color for light and dark themes
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030'; // Custom very dark blue
  const textColor = theme === 'light' ? 'text-[#1F1F1F]' : 'text-white';
  const buttonBackgroundColor = theme === 'light' ? 'bg-[#007BFF]' : 'bg-[#0056b3]';
  const buttonTextColor = 'text-white';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

  const cards = [1, 2]; // Dummy data for cards

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <View style={tw`flex-grow items-center justify-center p-5`}>
        <FlatList
          data={cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          snapToAlignment="center"
          snapToInterval={width * 0.8 + 20}
          decelerationRate="fast"
          renderItem={() => (
            <View style={[tw`mx-2`, { width: width * 0.8 }]}>
              <CreditCard />
            </View>
          )}
        />
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default MyCards;
