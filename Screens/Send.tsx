import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Modal, TextInput } from 'react-native';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator';
import { Input } from "@rneui/base";

const Send: React.FC = () => {
    const { theme } = useTheme();
    const [accountDetailsModalVisible, setAccountDetailsModalVisible] = useState<boolean>(false);
    const [number, onChangeNumber] = React.useState<boolean>();
    const [accNumberErrorMsg, setAccNumberErrorMsg] = useState<string>("Ayyy");
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
    const textColor = theme === 'light' ? '#333333' : '#DDDDDD';
    const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
    const buttonBackgroundColor = theme === 'light' ? '#94B9C5' : '#94B9C5';
    const buttonTextColor = theme === 'light' ? 'text-white' : 'text-black';

    const CustomButton = ({ title, onPress, iconName }: { title: string, onPress: () => void, iconName: string }) => (
        <TouchableOpacity
            style={[tw`flex-row items-center justify-center w-1/2 py-3 my-2 rounded-full mx-1`, { backgroundColor: buttonBackgroundColor }]}
            onPress={onPress}
        >
            <Icon name={iconName} size={28} color={theme === 'light' ? '#FFFFFF' : '#000000'} />
            <Text style={[tw`text-xl font-bold ml-2`, { color: theme === 'light' ? '#FFFFFF' : '#000000' }]}>{title}</Text>
        </TouchableOpacity>
    );

    const AccountDetail = ({ title, content }: { title: string, content: string }) => (
        <View style={tw`pb-4 pl-4`}>
            <Text style={[tw`text-sm`, { color: textColor }]}>{title}</Text>
            <Text style={[tw`font-bold text-2xl tracking-wide`, { color: textColor }]}>{content}</Text>
        </View>
    );

    return (
        <View style={[tw`flex-1 justify-between`, { backgroundColor }]}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
            <View style={tw`m-4`}>
                <Text style={[tw`text-2xl font-bold mb-2 mt-5`, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>Send</Text>
            </View>
            <View style={tw`p-5`}>
                <View style={tw`mt-4`}>
                    <AccountDetail title='Bla' content='Blala' />
                    <TextInput
                        style={tw``}
                        onChangeText={onChangeNumber}
                        value={number}
                        placeholder="useless placeholder"
                        keyboardType="numeric"
                        maxLength={15}
                    />
                    {/* <Input
                        containerStyle={{ borderColor: "white", borderWidth: 2, }}
                        disabledInputStyle={{ backgroundColor: "#ddd" }}
                        inputContainerStyle={{}}
                        errorMessage={accNumberErrorMsg}
                        errorStyle={{ color: "red" }}
                        errorProps={{}}
                        inputStyle={{ color: textColor }}
                        label="Account Number"
                        labelStyle={{}}
                        labelProps={{}}
                        leftIcon={
                            <Icon
                                name="hash"
                                size={20}
                                color="white"
                            />
                        }
                        leftIconContainerStyle={{}}
                        rightIcon={<Icon name="x" size={20} color="white" />}
                        rightIconContainerStyle={{}}
                        placeholder="XXXX XXXX XXXX XXXX"
                    /> */}
                </View>
                <Text style={[tw`text-base mt-10`, { color: textColor }]}>
                    This is your personal QR Code, you can use it to recieve transfers from others by simply showing it to the sender's scanner.
                </Text>
                <Text style={[tw`text-base mt-10 mb-2`, { color: textColor }]}>
                    or you can share your account details instead
                </Text>
                <TouchableOpacity
                    style={{ backgroundColor: buttonBackgroundColor, padding: 16, borderRadius: 8, alignItems: 'center' }}
                    onPress={() => setAccountDetailsModalVisible(true)}
                >
                    <Text style={[tw`text-base font-bold`, { color: buttonTextColor }]}>
                        Show Account Details
                    </Text>
                </TouchableOpacity>
            </View>
            <BottomTab navigation={navigation} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={accountDetailsModalVisible}
                onRequestClose={() => {
                    setAccountDetailsModalVisible(!accountDetailsModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-4/6 flex-col justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        <View style={tw`flex-row justify-between items-center w-full`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Account Details
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setAccountDetailsModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>
                        {/* Account Details Text */}
                        <View style={tw`my-4`}>
                            <AccountDetail title='Account Holder' content='John Doe' />
                            <AccountDetail title='Account Number' content='1234 5678 9876 5432' />
                            <AccountDetail title='Currency' content='Syrian Pound (SYP)' />
                            <AccountDetail title='IBAN' content='282608010SY0000000000' />
                        </View>
                        <TouchableOpacity
                            style={[tw`flex-row items-center justify-center py-3 mt-2 rounded-lg mx-1 px-4`, { backgroundColor: buttonBackgroundColor }]}
                            onPress={
                                // Generate PDF/JPG and share code here
                                () => setAccountDetailsModalVisible(false)
                            }
                        >
                            <Icon name={"share"} size={20} color={theme === 'light' ? '#FFFFFF' : '#000000'} />
                            <Text style={[tw`text-base font-bold ml-2`, { color: theme === 'light' ? '#FFFFFF' : '#000000' }]}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

export default Send;
