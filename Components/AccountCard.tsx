import { View, Text } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AccountCard = () => {
    return (
        <View style={[tw`flex-col p-4 rounded-3xl font-bold w-100 h-1/3 justify-between bg-lime-900`]}>
            <View style={tw`flex-row w-100`}>
                <Text style={tw`text-white text-lg`}>Checking</Text>
            </View>
            <View style={tw`flex-col w-100`}>
                <Text style={tw`text-white text-sm`}>Current Balance</Text>
                <Text style={tw`text-white font-bold text-3xl`}>$10,546.70</Text>
            </View>
            <TouchableOpacity onPress={() => console.log("View Account Tapped")} style={tw`flex-row w-100 justify-end items-center px-7`}>
                <Text style={tw`text-white text-lg pr-2`}>View Account</Text>
                <Icon name="arrow-right-circle" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default AccountCard;
