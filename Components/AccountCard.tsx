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
    <View style={[tw`flex-col p-4 rounded-3xl font-bold w-full h-45 justify-between bg-gray-600`]} >
      <View style={tw`flex-row w-full`}>
        <Text style={tw`text-white text-lg`}>{type}</Text>
      </View>
      <View style={tw`flex-col w-full`}>
        <Text style={tw`text-white text-sm`}>Current Balance</Text>
        <Text style={tw`text-white font-bold text-3xl`}>{balance}</Text>
      </View>
      <View style={tw`w-full flex-row justify-end rounded-full`}>
        <TouchableOpacity onPress={() => console.log("View Account Tapped")} style={tw`flex-row justify-end items-center px-1`}>
          <Text style={tw`text-white text-lg pr-1`}>Details</Text>
          <Icon name="arrow-right-circle" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountCard;
