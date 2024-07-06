import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Import the background image
import BackgroundImage from '../assets/Group 48095400.png';

interface AccountCardProps {
  type: string;
  balance: string;
}

const AccountCard = ({ navigation, type, balance }) => {
  return (
    <ImageBackground
      source={BackgroundImage}
      style={[tw`flex-col p-4 rounded-3xl font-bold h-45 justify-between`]}
      imageStyle={tw`rounded-3xl`}
    >
      <View style={tw`flex-row w-full`}>
        <Text style={tw`text-white text-lg`}>{type}</Text>
      </View>
      <View style={tw`flex-col w-full`}>
        <Text style={tw`text-white text-sm`}>Current Balance</Text>
        <Text style={tw`text-white font-bold text-3xl`}>{balance}</Text>
      </View>
      <View style={tw`w-full flex-row justify-end rounded-full`}>
        <TouchableOpacity onPress={() => navigation.navigate("Receive")} style={tw`flex-row justify-end items-center px-1`}>
          <Text style={tw`text-white text-lg pr-1`}>Details</Text>
          <Icon name="arrow-right-circle" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default AccountCard;
