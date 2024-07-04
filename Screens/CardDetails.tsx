import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Modal, ActivityIndicator, Alert, } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axios from 'axios';
import baseUrl from '../baseUrl';
import { decryptData, encryptData } from '../crypto-utils';
import NfcManager, { NfcTech, NfcEvents, TagEvent, Ndef } from 'react-native-nfc-manager';

const CardDetails: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { cardNumber } = route.params; // Retrieve the cardNumber parameter

    const { theme } = useTheme();
    const jwt = useSelector((state: RootState) => state.auth.jwt);
    const aesKey = useSelector((state: RootState) => state.auth.aesKey);

    const [card, setCard] = useState({});

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.post(`${baseUrl}/card/${cardNumber}`, { jwt });
                const decryptedPayload = decryptData(response.data.payload, aesKey);
                setCard(decryptedPayload);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchDetails();
    }, []);

    const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
    const textColor = theme === 'light' ? '#333333' : '#DDDDDD';
    const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
    const buttonBackgroundColor = theme === 'light' ? '#94B9C5' : '#94B9C5';
    const buttonTextColor = theme === 'light' ? 'text-white' : 'text-black';

    const [loading, setLoading] = useState<boolean>(false);

    const [deleteCardModalVisible, setDeleteCardModalVisible] = useState<boolean>(false);
    const [cardDeleteSuccess, setCardDeleteSuccess] = useState<boolean>(false);

    const [changePINModalVisible, setChangePINModalVisible] = useState<boolean>(false);
    const [newPIN, setNewPIN] = useState<string>('');
    const [confirmNewPIN, setConfirmNewPIN] = useState<string>('');
    const [changePINSuccess, setChangePINSuccess] = useState<boolean>(false);

    const [topupModalVisible, setTopupModalVisible] = useState<boolean>(false);
    const [topupAmount, setTopupAmount] = useState<string>("");
    const [topupSuccess, setTopupSuccess] = useState<boolean>(false);

    const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>(false);
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

    const [nfcModalVisible, setNfcModalVisible] = useState<boolean>(false);
    const [nfcTagDetected, setNfcTagDetected] = useState<boolean>(false);
    const [nfcTagDetails, setNfcTagDetails] = useState<string>('');
    const [nfcWriteSuccess, setNfcWriteSuccess] = useState<boolean>(false);

    const AccountDetail = ({ title, content }: { title: string, content: string }) => (
        <View style={tw`pb-4 pl-4`}>
            <Text style={[tw`text-sm`, { color: textColor }]}>{title}</Text>
            <Text style={[tw`font-bold text-2xl tracking-wide`, { color: textColor }]}>{content}</Text>
        </View>
    );

    const handleNfcWrite = async () => {
        try {
            setLoading(true);
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const bytes = Ndef.encodeMessage([Ndef.textRecord(JSON.stringify(card))]);
            if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes);
                setNfcWriteSuccess(true);
                Alert.alert('Success', 'Card details written to NFC tag successfully.');
            }
        } catch (ex) {
            console.warn(ex);
            Alert.alert('Error', 'Failed to write to NFC tag.');
        } finally {
            setLoading(false);
            NfcManager.cancelTechnologyRequest();
        }
    };

    return (
        <View style={[tw`flex-col h-full justify-between`, { backgroundColor }]}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
            <View>
                <View style={tw`flex-row justify-between items-center mt-4 mx-4 py-2`}>
                    <View style={tw`flex-row items-center`}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
                            <Icon name="arrow-left" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                        </TouchableOpacity>
                        <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>Card Details</Text>
                    </View>
                </View>
                {Object.keys(card).length > 0 &&
                    <View style={tw`mt-8`}>
                        <AccountDetail title="Card Name" content={card.cardName} />
                        <AccountDetail title="Card Number" content={card.id.replace(/(.{4})/g, '$1  ').trim()} />
                        <AccountDetail title="Card Balance" content={`SYP ${card.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} />
                        <AccountDetail title="Expiry Date" content={`${new Date(card.expiryDate).getMonth() + 1}/${new Date(card.expiryDate).getFullYear()}`} />
                        <AccountDetail title="CVV" content={card.cvv} />
                        <AccountDetail title="Issue Date Date" content={`${new Date(card.createdAt).getMonth() + 1}/${new Date(card.createdAt).getFullYear()}`} />

                        <View style={tw`w-full px-2 mt-8`}>
                            <View style={tw`flex-row justify-center items-center`}>
                                <TouchableOpacity
                                    style={tw`bg-white w-grow m-1 py-4 rounded-lg flex-row justify-center items-center`}
                                    onPress={() => {
                                        setTopupModalVisible(true);
                                    }}
                                >
                                    <Icon name="plus" size={20} color={"black"} />
                                    <Text style={tw`text-lg font-bold ml-1`}>Topup</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={tw`bg-white w-grow m-1 py-4 rounded-lg flex-row justify-center items-center`}
                                    onPress={() => {
                                        setWithdrawModalVisible(true);
                                    }}
                                >
                                    <Icon name="minus" size={20} color={"black"} />
                                    <Text style={tw`text-lg font-bold ml-1`}>Withdraw</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={tw`flex-row justify-center items-center`}>
                                <TouchableOpacity
                                    style={tw`bg-white w-grow m-1 py-4 rounded-lg flex-row justify-center items-center`}
                                    onPress={() => { setChangePINModalVisible(true); }}
                                >
                                    <Icon name="edit-2" size={20} color={"black"} />
                                    <Text style={tw`text-lg font-bold ml-1`}>Change PIN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={tw`bg-white w-grow m-1 py-4 rounded-lg flex-row justify-center items-center`}
                                    onPress={() => { setDeleteCardModalVisible(true); }}
                                >
                                    <Icon name="trash" size={20} color={"black"} />
                                    <Text style={tw`text-lg font-bold ml-1`}>Cancel Card</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={tw`flex-row justify-center items-center`}>
                                <TouchableOpacity
                                    style={tw`bg-white w-grow m-1 py-4 rounded-lg flex-row justify-center items-center`}
                                    onPress={() => { setNfcModalVisible(true); }}
                                >
                                    <Icon name="wifi" size={20} color={"black"} />
                                    <Text style={tw`text-lg font-bold ml-1`}>Create Digital Card</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={nfcModalVisible}
                onRequestClose={() => {
                    setNfcModalVisible(!nfcModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-3/6 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        <View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Create Digital Card
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setNfcModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>
                        <View style={tw`w-full h-grow flex-col justify-between`}>
                            <View style={tw`w-full flex-col items-center justify-center`}>
                                <Icon name={"wifi"} size={100} color={textColor} />
                                <Text style={[tw`text-2xl font-bold text-center`, { color: textColor }]}>
                                    Ready to write card details to NFC tag?
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8
                                }]}
                                onPress={handleNfcWrite}
                            >
                                <Icon name={"wifi"} size={20} color={textColor} />
                                <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                    Write to NFC Tag
                                </Text>
                            </TouchableOpacity>
                            {loading && (
                                <ActivityIndicator size="large" color={textColor} style={tw`mt-4`} />
                            )}
                            {nfcWriteSuccess && (
                                <View style={tw`flex-row justify-center items-center mt-4`}>
                                    <Icon name="check-circle" size={28} color="green" />
                                    <Text style={[tw`text-lg font-bold ml-2`, { color: 'green' }]}>
                                        Write Successful
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
            <BottomTab navigation={navigation} />
        </View>
    );
};

export default CardDetails;
