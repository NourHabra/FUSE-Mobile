import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Modal, Keyboard, Platform, TextInputProps, ActivityIndicator, Alert, } from 'react-native';
import TextInput from '../Components/TextInput';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axios from 'axios';
import baseUrl from '../baseUrl';
import { decryptData, encryptData } from '../crypto-utils';

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

    const AccountDetail = ({ title, content }: { title: string, content: string }) => (
        <View style={tw`pb-4 pl-4`}>
            <Text style={[tw`text-sm`, { color: textColor }]}>{title}</Text>
            <Text style={[tw`font-bold text-2xl tracking-wide`, { color: textColor }]}>{content}</Text>
        </View>
    );
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
                        {/* <View style={tw`w-full flex-row items-center justify-between pr-2`}>
                            <AccountDetail title="Card Balance" content={`SYP ${card.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} />
                            <TouchableOpacity
                                style={tw`bg-white w-auto h-1/2 px-4 rounded-lg flex-row justify-center items-center`}
                                onPress={() => { }}
                            >
                                <Icon name="plus" size={20} color={"black"} />
                                <Text style={tw`text-lg font-bold ml-1`}>Add / Withdraw</Text>
                            </TouchableOpacity>
                        </View> */}
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
                        </View>
                    </View>
                }
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteCardModalVisible}
                onRequestClose={() => {
                    setDeleteCardModalVisible(!deleteCardModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-3/6 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        <View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Delete Card
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setDeleteCardModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>
                        {!loading && !cardDeleteSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center`}>
                                    <Icon name={"alert-triangle"} size={100} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold text-center`, { color: textColor }]}>
                                        Are you sure you want to delete this card?
                                    </Text>
                                    <Text style={[tw`text-base font-bold mt-2 text-center`, { color: textColor }]}>
                                        This action cannot be undone
                                    </Text>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                        onPress={async () => {
                                            setLoading(true);

                                            try {
                                                const response = await axios.delete(`${baseUrl}/card/${cardNumber}`, {
                                                    data: {
                                                        jwt: jwt
                                                    }
                                                });

                                                const decryptedPayload = decryptData(response.data.payload, aesKey);
                                                console.log(decryptedPayload);
                                                if (response.status == 200) {
                                                    setCardDeleteSuccess(true);
                                                } else {
                                                    Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                                }
                                            } catch (error: any) {
                                                Alert.alert('Error', error.message || 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                            } finally {
                                                setLoading(false); // Stop loading
                                            }
                                        }}
                                    >
                                        <Icon name={"trash"} size={20} color={textColor} />
                                        <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                            Delete Card
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setDeleteCardModalVisible(false);
                                        }}
                                    >
                                        <Text style={[tw`text-base font-bold mt-1 text-center`, { color: textColor }]}>
                                            Keep this card
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {loading &&
                            <View style={tw`w-full h-grow flex-col justify-center`}>
                                <ActivityIndicator size="large" color={textColor} />
                            </View>
                        }
                        {!loading && cardDeleteSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center mt-8`}>
                                    <Icon name={"trash"} size={100} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold text-center mt-2`, { color: textColor }]}>
                                        Card Deleted
                                    </Text>
                                    <Text style={[tw`text-2xl font-bold text-center`, { color: textColor }]}>
                                        Successfully
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                    onPress={async () => {
                                        setDeleteCardModalVisible(false);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        });
                                    }}
                                >
                                    <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                        Back to Home
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={changePINModalVisible}
                onRequestClose={() => {
                    setChangePINModalVisible(!changePINModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-3/6 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        {<View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Change Card PIN
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setChangePINModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>}
                        {!loading && !changePINSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center`}>
                                    <View style={tw`w-full`}>
                                        <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>New PIN</Text>
                                        <View style={tw`flex-row w-full justify-between`}>
                                            <TextInput
                                                style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                                                onChangeText={(text: any) => {
                                                    setNewPIN(text);
                                                }}
                                                placeholder="XXXX"
                                                maxLength={4}
                                                value={newPIN}
                                                keyboardType='numeric'
                                                placeholderTextColor={textColor}
                                                secureTextEntry={true}
                                            />
                                        </View>
                                    </View>
                                    <View style={tw`w-full`}>
                                        <Text style={[tw`text-sm pl-2 pb-1 mt-4`, { color: textColor }]}>Confirm New PIN</Text>
                                        <View style={tw`flex-row w-full justify-between`}>
                                            <TextInput
                                                style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                                                onChangeText={(text: any) => {
                                                    setConfirmNewPIN(text);
                                                }}
                                                placeholder="XXXX"
                                                maxLength={4}
                                                value={confirmNewPIN}
                                                keyboardType='numeric'
                                                placeholderTextColor={textColor}
                                                secureTextEntry={true}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                        onPress={async () => {
                                            if (newPIN.length != 4 || confirmNewPIN.length != 4 || newPIN != confirmNewPIN) {
                                                Alert.alert('Error', 'Please enter matching 4-digit PINs');
                                                return;
                                            }

                                            setLoading(true);

                                            try {

                                                const response = await axios.put(`${baseUrl}/card/pin/${cardNumber}`, {
                                                    jwt,
                                                    payload: encryptData({
                                                        PIN: newPIN,
                                                        rPIN: confirmNewPIN
                                                    }, aesKey)
                                                });

                                                const decryptedPayload = decryptData(response.data.payload, aesKey);
                                                console.log(decryptedPayload);
                                                if (response.status == 200) {
                                                    setChangePINSuccess(true);
                                                } else {
                                                    Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                                }
                                            } catch (error: any) {
                                                Alert.alert('Error', error.message || 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                            } finally {
                                                setLoading(false); // Stop loading
                                            }
                                        }}
                                    >
                                        <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                            Change PIN
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {loading &&
                            <View style={tw`w-full h-grow flex-col justify-center`}>
                                <ActivityIndicator size="large" color={textColor} />
                            </View>
                        }

                        {!loading && changePINSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center mt-8`}>
                                    <Icon name={"check"} size={100} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold text-center mt-2`, { color: textColor }]}>
                                        PIN Changed
                                    </Text>
                                    <Text style={[tw`text-2xl font-bold text-center`, { color: textColor }]}>
                                        Successfully
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                    onPress={async () => {
                                        setChangePINModalVisible(false);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        });
                                    }}
                                >
                                    <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                        Back to Home
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={topupModalVisible}
                onRequestClose={() => {
                    setTopupModalVisible(!topupModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-3/6 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        {<View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Topup Card
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setTopupModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>}
                        {!loading && !topupSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center`}>
                                    <View style={tw`w-full`}>
                                        <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Topup Amount</Text>
                                        <View style={tw`flex-row w-full justify-between`}>
                                            <TextInput
                                                style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                                                onChangeText={(text: any) => {
                                                    setTopupAmount(text);
                                                }}
                                                placeholder="SYP X,XXX,XXX"
                                                maxLength={7}
                                                value={topupAmount}
                                                keyboardType='numeric'
                                                placeholderTextColor={textColor}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                        onPress={async () => {
                                            if (topupAmount.length < 1) {
                                                Alert.alert('Error', 'Please enter a valid topup amount');
                                                return;
                                            }

                                            setLoading(true);

                                            try {

                                                const response = await axios.put(`${baseUrl}/card/balance/${cardNumber}`, {
                                                    jwt,
                                                    payload: encryptData({
                                                        amount: Number.parseFloat(topupAmount),
                                                        type: "Deposit"
                                                    }, aesKey)
                                                });

                                                const decryptedPayload = decryptData(response.data.payload, aesKey);
                                                console.log(decryptedPayload);
                                                if (response.status == 200) {
                                                    setTopupSuccess(true);
                                                } else {
                                                    Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                                }
                                            } catch (error: any) {
                                                Alert.alert('Error', error.message || 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                            } finally {
                                                setLoading(false); // Stop loading
                                            }
                                        }}
                                    >
                                        <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                            Top Up Card
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {loading &&
                            <View style={tw`w-full h-grow flex-col justify-center`}>
                                <ActivityIndicator size="large" color={textColor} />
                            </View>
                        }

                        {!loading && topupSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center mt-8`}>
                                    <Icon name={"check"} size={100} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold text-center mt-2`, { color: textColor }]}>
                                        Card topped up
                                    </Text>
                                    <Text style={[tw`text-2xl font-bold text-center`, { color: textColor }]}>
                                        Successfully
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                    onPress={async () => {
                                        setTopupModalVisible(false);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        });
                                    }}
                                >
                                    <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                        Back to Home
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={withdrawModalVisible}
                onRequestClose={() => {
                    setWithdrawModalVisible(!withdrawModalVisible);
                }}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-3/6 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
                        {<View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Withdraw from Card
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setWithdrawModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>}
                        {!loading && !withdrawSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center`}>
                                    <View style={tw`w-full`}>
                                        <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Topup Amount</Text>
                                        <View style={tw`flex-row w-full justify-between`}>
                                            <TextInput
                                                style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                                                onChangeText={(text: any) => {
                                                    setWithdrawAmount(text);
                                                }}
                                                placeholder="SYP X,XXX,XXX"
                                                maxLength={7}
                                                value={withdrawAmount}
                                                keyboardType='numeric'
                                                placeholderTextColor={textColor}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                        onPress={async () => {
                                            if (withdrawAmount.length < 1) {
                                                Alert.alert('Error', 'Please enter a valid withdraw amount');
                                                return;
                                            }

                                            setLoading(true);

                                            try {

                                                const response = await axios.put(`${baseUrl}/card/balance/${cardNumber}`, {
                                                    jwt,
                                                    payload: encryptData({
                                                        amount: Number.parseFloat(withdrawAmount),
                                                        type: "Withdraw"
                                                    }, aesKey)
                                                });

                                                const decryptedPayload = decryptData(response.data.payload, aesKey);
                                                console.log(decryptedPayload);
                                                if (response.status == 200) {
                                                    setWithdrawSuccess(true);
                                                } else {
                                                    Alert.alert('Error', 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                                }
                                            } catch (error: any) {
                                                Alert.alert('Error', error.message || 'Something went wrong', [{ text: 'OK' }], { cancelable: false });
                                            } finally {
                                                setLoading(false); // Stop loading
                                            }
                                        }}
                                    >
                                        <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                            Withdraw from Card
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {loading &&
                            <View style={tw`w-full h-grow flex-col justify-center`}>
                                <ActivityIndicator size="large" color={textColor} />
                            </View>
                        }

                        {!loading && withdrawSuccess &&
                            <View style={tw`w-full h-grow flex-col justify-between`}>
                                <View style={tw`w-full flex-col items-center justify-center mt-8`}>
                                    <Icon name={"check"} size={100} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold text-center mt-2`, { color: textColor }]}>
                                        Withdraw Successful
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                    onPress={async () => {
                                        setWithdrawModalVisible(false);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        });
                                    }}
                                >
                                    <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                        Back to Home
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
            <BottomTab navigation={navigation} />
        </View>


    );
};

export default CardDetails;