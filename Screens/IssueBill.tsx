import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Modal, ActivityIndicator, Keyboard } from 'react-native';
import {
    TextInput as DefaultTextInput,
    Platform,
    TextInputProps,
    Image,
} from "react-native";
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axios from 'axios';
import baseUrl from '../baseUrl';
import { decryptData, encryptData } from '../crypto-utils';
import QRCodeStyled from 'react-native-qrcode-styled';



const TextInput = ({
    placeholderTextColor,
    ...props
}: TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleEndEditing = () => {
        setIsFocused(false);
    };

    return (
        <DefaultTextInput
            {...props}
            onFocus={handleFocus}
            onEndEditing={handleEndEditing}
            style={[
                tw`bg-neutral-100 dark:bg-neutral-900 border border-black/20 dark:border-white/20 rounded-md h-12 px-4 text-neutral-950 dark:text-neutral-50`,
                isFocused && Platform.OS !== "web" ? tw`border-blue-500` : {},
                props.style,
            ]}
            placeholderTextColor={
                placeholderTextColor || tw.color("text-neutral-500")
            }
        />
    );
};

const IssueBill: React.FC = () => {
    const { theme } = useTheme();
    const [logoBase64, setLogoBase64] = useState<string>('');

    const jwt = useSelector((state: RootState) => state.auth.jwt);
    const aesKey = useSelector((state: RootState) => state.auth.aesKey);

    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [finalDetailsModalVisible, setFinalDetailsModalVisible] = useState<boolean>(false);

    const [bill, setBill] = useState<object>({});

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
    const textColor = theme === 'light' ? '#333333' : '#DDDDDD';
    const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
    const buttonBackgroundColor = theme === 'light' ? '#94B9C5' : '#94B9C5';
    const buttonTextColor = theme === 'light' ? 'text-white' : 'text-black';

    useEffect(() => {
        const loadLogo = async () => {
            const logoAsset = Asset.fromModule(require('../assets/FuseLogo.png'));
            await logoAsset.downloadAsync();
            const base64 = await FileSystem.readAsStringAsync(logoAsset.localUri || logoAsset.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setLogoBase64(`data:image/png;base64,${base64}`);
        };

        loadLogo();
    }, []);

    const AccountDetail = ({ title, content }: { title: string, content: string }) => (
        <View style={tw`pb-4 pl-4`}>
            <Text style={[tw`text-sm`, { color: textColor }]}>{title}</Text>
            <Text style={[tw`font-bold text-2xl tracking-wide`, { color: textColor }]}>{content}</Text>
        </View>
    );

    const generatePDF = async () => {
        if (!logoBase64) {
            console.error('Logo base64 data is not loaded yet');
            return;
        }

        const htmlContent = `
            <html>
            <body>
                <div style="padding: 20px; position: relative;">
                    <img src="${logoBase64}" style="position: absolute; top: 20px; left: 20px; width: 100px; height: auto;" />
                    <div style="margin-top: 140px;">
                        <h1>Account Details</h1>
                        <p><strong>Sender:</strong> ${"Sender Name"}</p>
                        <p><strong>Account Number:</strong> ${bill?.accountNumber}</p>
                        <p><strong>Currency:</strong> ${bill?.currency}</p>
                        <p><strong>Amount:</strong> ${amount}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const fileName = `Transaction_${bill?.accountNumber.replace(/\s+/g, '_')}.pdf`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.moveAsync({
            from: uri,
            to: newUri,
        });
        await Sharing.shareAsync(newUri);
    };
    return (
        <View style={[tw`flex-1 justify-between`, { backgroundColor }]}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
            <View style={tw`flex-row items-center mt-4 mx-4 py-2`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
                    <Icon name="arrow-left" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>Issue Bill</Text>
            </View>
            <View style={tw`px-5 pb-5 flex-col justify-between h-4/5`}>
                <View style={tw`flex-col justify-start`}>
                    <View>
                        <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Amount</Text>
                        <View style={tw`flex-row w-full justify-between`}>
                            <TextInput
                                style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                                onChangeText={(text) => {
                                    setAmount(text);
                                }}
                                placeholder="SYP XXXX"
                                keyboardType="number-pad"
                                maxLength={16}
                                placeholderTextColor={textColor}
                                value={amount}
                            />
                        </View>
                    </View>
                    <View style={tw`mt-4`}>
                        <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Description (Optional)</Text>
                        <View style={tw`flex-row w-full justify-between`}>
                            <TextInput
                                style={[tw`flex-row  w-grow mr-1 border-2 bg-transparent pt-3`, { borderColor: textColor, color: textColor, height: 150, textAlignVertical: 'top' }]}
                                onChangeText={(text) => {
                                    setDescription(text);
                                }}
                                placeholder="(Optional) Describe this transaction here..."
                                maxLength={250}
                                placeholderTextColor={textColor}
                                multiline={true}
                                value={description || ""}
                            />
                        </View>
                        <TouchableOpacity
                            style={[tw`flex-row justify-center items-center mt-8`, { backgroundColor: buttonBackgroundColor, padding: 16, borderRadius: 8 }]}
                            onPress={async () => {
                                try {
                                    console.log(amount);
                                    console.log(description);

                                    const response = await axios.put(`${baseUrl}/bill`, {
                                        jwt,
                                        payload: encryptData({
                                            amount: Number.parseFloat(amount),
                                            details: description
                                        }, aesKey)
                                    });
                                    const decryptedPayload = decryptData(response.data.payload, aesKey);
                                    console.log(decryptedPayload);
                                    setBill(decryptedPayload.bill);
                                    setFinalDetailsModalVisible(true);
                                } catch (error) {
                                    console.error('Error fetching user data:', error);
                                }
                            }}
                        >
                            <Icon name={"check"} size={20} color={theme === 'light' ? '#FFFFFF' : '#000000'} />
                            <Text style={[tw`text-base font-bold ml-2`, { color: buttonTextColor }]}>
                                Issue Bill
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={finalDetailsModalVisible}
                onRequestClose={() => {
                    setFinalDetailsModalVisible(!finalDetailsModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-7/8 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        <View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Bill Issued Successfully
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setFinalDetailsModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>
                        <View style={tw`w-full h-grow flex-col justify-between`}>
                            {Object.keys(bill).length > 0 &&
                                <View style={tw`w-full`}>
                                    <AccountDetail title='Bill Number' content={bill.id} />
                                    <AccountDetail title='Category' content={bill.category} />
                                    <AccountDetail title='Amount' content={bill.amount} />
                                    <AccountDetail title='Description' content={bill.details} />
                                    <View style={tw`flex-row justify-between items-center w-full pr-4`}>
                                        <AccountDetail title='Status' content={bill.status} />
                                        <TouchableOpacity onPress={reloadBill()}>
                                            <Icon name="rotate-ccw" size={25} color={textColor} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={tw`items-center`}>
                                        <View style={tw`bg-white rounded-full`}>
                                            <QRCodeStyled
                                                data={bill.id.toString()}
                                                style={[tw`rounded-2xl`, { backgroundColor: 'white' }]}
                                                padding={20}
                                                pieceSize={8}
                                                pieceCornerType='rounded'
                                                pieceBorderRadius={3}
                                                isPiecesGlued={true}
                                            />
                                        </View>
                                    </View>
                                </View>}
                            <View>
                                <TouchableOpacity
                                    style={[tw`flex-row justify-center items-center border-2 w-full`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                    onPress={async () => {
                                        setFinalDetailsModalVisible(false);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        });
                                    }}
                                >
                                    <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                        Return to Home
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <BottomTab navigation={navigation} />

        </View >
    );
};

export default IssueBill;
