import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface AccountCardProps {
  type: string;
  balance: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ type, balance }) => {
  return (
    <View style={[tw`flex-col p-4 rounded-3xl font-bold w-full h-40 justify-between bg-gray-600`]}>
      <View style={tw`flex-row w-full`}>
        <Text style={tw`text-white text-lg`}>{type}</Text>
      </View>
      <View style={tw`flex-col w-full`}>
        <Text style={tw`text-white text-sm`}>Current Balance</Text>
        <Text style={tw`text-white font-bold text-3xl`}>{balance}</Text>
      </View>
      <TouchableOpacity onPress={() => console.log("View Account Tapped")} style={tw`flex-row w-full justify-end items-center px-7`}>
        <Text style={tw`text-white text-lg pr-2`}>View Account</Text>
        <Icon name="arrow-right-circle" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default AccountCard;
