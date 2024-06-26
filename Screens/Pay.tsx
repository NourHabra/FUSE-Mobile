import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Modal, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
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
import { Input } from "@rneui/base";
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import CreditCard from '../Components/CreditCard';


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

const Pay: React.FC = () => {
    const { theme } = useTheme();
    const [accountDetailsModalVisible, setAccountDetailsModalVisible] = useState<boolean>(false);
    const [number, onChangeNumber] = React.useState<boolean>();
    const [accNumberErrorMsg, setAccNumberErrorMsg] = useState<string>("Ayyy");
    const [logoBase64, setLogoBase64] = useState<string>('');

    const [message, setMessage] = useState<string>("");
    const [bill, setBill] = useState<object>({
        merchant: "John Doe",
        number: "1234 1234 1234 1234",
        address: "United States",
        category: "Food/Groceries",
        amount: "$1,200.60"
    });
    const [billNumber, setBillNumber] = useState<string>("");
    const [accountFound, setAccountFound] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [billFound, setBillFound] = useState<boolean>(true);
    const [showBillDetails, setShowBillDetails] = useState<boolean>(false);
    const [billNotFound, setBillNotFound] = useState<boolean>(false);
    const [billConfirmed, setBillConfirmed] = useState<boolean>(false);
    const [showSelectCard, setShowSelectCard] = useState<boolean>(false);
    const [showTransactionStatus, setShowTransactionStatus] = useState<boolean>(false);
    const [transactionStatus, setTransactionStatus] = useState<string>("");
    const [showCta, setShowCta] = useState<boolean>(true);
    const [showSearchbar, setShowSearchbar] = useState<boolean>(true);
    const [showFinalDetails, setShowFinalDetails] = useState<boolean>(false);

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

    const MyInputField = ({ title, placeholder }: { title: string, placeholder: string }) => (
        <View style={tw`pb-4`}>
            <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>{title}</Text>
            <TextInput
                style={tw`flex-row`}
                onChangeText={(text) => { setBillNumber(text); }}
                placeholder={placeholder}
                keyboardType="number-pad"
                maxLength={30}
            />
        </View>
    );

    const initializeFields = () => {
        setAccountFound(false);
        setBillNotFound(false);
        setBillNumber("");
        setMessage("");
        setAccountDetailsModalVisible(false);
        setLoading(false);
        setShowBillDetails(false);
        setShowFinalDetails(false);
        setShowCta(true);
        setShowSearchbar(true);
        setShowSelectCard(false);
        setShowTransactionStatus(false);
    };

    const handleBarCodeRead = (e: BarCodeReadEvent) => {
        setBillNumber(e.data);
        setMessage(e.data);
        setAccountDetailsModalVisible(false);
        confirmBill
    };

    const searchForBill = () => {
        setShowBillDetails(true);
        setShowCta(false);
        setShowSearchbar(false);
    };

    const confirmBill = () => {
        setBillConfirmed(true);
        setShowBillDetails(false);
        setShowCta(false);
        setShowSearchbar(false);
        setShowFinalDetails(false);
        setShowSelectCard(true);
    };

    const selectCard = () => {
        setShowSelectCard(false);
        setShowFinalDetails(true);
    };

    const confirmTransaction = () => {
        setShowTransactionStatus(true);
        setShowBillDetails(false);
        setShowCta(false);
        setShowSearchbar(false);
        setShowFinalDetails(false);
        setTransactionStatus("success");
    };

    const cancelTransaction = () => {
        initializeFields();
    };

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
                        <p><strong>Account Number:</strong> ${bill?.billNumber}</p>
                        <p><strong>Currency:</strong> ${bill?.currency}</p>
                        <p><strong>Amount:</strong> ${bill?.amount}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const fileName = `Transaction_${bill?.billNumber.replace(/\s+/g, '_')}.pdf`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.moveAsync({
            from: uri,
            to: newUri,
        });
        await Sharing.shareAsync(newUri);
    };
    return (
        <View style={[tw`flex-col h-full justify-between`, { backgroundColor }]}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
            <View style={tw`flex-row items-center mt-4 mx-4 py-2`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
                    <Icon name="arrow-left" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
                <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>Pay</Text>
            </View>
            <View style={tw`px-5 pb-5 flex-col justify-between h-4/5`}>
                {/* Content excluding QR Code CTA */}
                <View style={tw`flex-col justify-start`}>
                    {/* Search Section*/}
                    {showSearchbar && <View style={tw``}>
                        {/* Bill Number Input Field */}
                        <View style={tw``}>
                            <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Bill Number</Text>
                            <View style={tw`flex-row w-full justify-between`}>
                                <TextInput
                                    style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                                    onChangeText={(text) => {
                                        setBillNumber(text);
                                    }}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    keyboardType="number-pad"
                                    maxLength={16}
                                    placeholderTextColor={textColor}
                                    onTouchStart={() => initializeFields()}
                                />
                                <TouchableOpacity
                                    style={[
                                        tw`flex-row items-center justify-center py-3 rounded-lg px-4 border-2`,
                                        { borderColor: textColor },
                                    ]}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        setMessage(billNumber);
                                        searchForBill();
                                    }}
                                >
                                    <Icon
                                        name={"search"}
                                        size={20}
                                        color={textColor}
                                    />
                                    {/* <Text style={[tw`text-base font-bold ml-2`, { color: theme === 'light' ? '#FFFFFF' : '#000000' }]}>Share</Text> */}
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                    }

                    {/* Middle Content */}
                    <View style={tw`mt-4 h-full`}>
                        {/* Loading */}
                        {loading &&
                            <View style={tw`flex-row justify-center items-center w-full mt-24`}>
                                <ActivityIndicator size="large" color={textColor} />
                            </View>
                        }

                        {/* Bill Not Found */}
                        {billNotFound && <View style={tw`flex-col items-center w-full mt-16`}>
                            <Icon name={"file-minus"} size={120} color={textColor} />
                            <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
                                Bill Not Found
                            </Text>
                            <Text style={[tw`text-sm font-bold text-center w-2/3`, { color: textColor }]}>
                                Please make sure you have entered the correct bill number and try again.
                            </Text>
                        </View>}

                        {/* Bill details */}
                        {billFound && showBillDetails && <View>
                            <Text style={[tw`text-2xl font-bold mb-2`, { color: textColor }]}>Bill Details</Text>
                            <View style={tw`w-full flex-row justify-center pb-4`}>
                                <View style={[tw`w-full border h-0`, { borderColor: textColor }]} />
                            </View>
                            <AccountDetail title='Bill Number' content={bill.number} />
                            <AccountDetail title='Category' content={bill.category} />
                            <AccountDetail title='Merchant' content={bill.merchant} />
                            <AccountDetail title='Address' content={bill.address} />
                            <AccountDetail title='Amount' content={bill.amount} />
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center`, { backgroundColor: buttonBackgroundColor, padding: 16, borderRadius: 8 }]}
                                onPress={() => confirmBill()}
                            >
                                <Icon name={"check"} size={20} color={theme === 'light' ? '#FFFFFF' : '#000000'} />
                                <Text style={[tw`text-base font-bold ml-2`, { color: buttonTextColor }]}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center p-4`]}
                                onPress={() => cancelTransaction()}
                            >
                                <Text style={[tw`text-sm font-bold`, { color: textColor }]}>
                                    Pay a differemt bill instead
                                </Text>
                            </TouchableOpacity>
                        </View>}

                        {/* Bill details */}
                        {showSelectCard && <View style={tw`h-full`}>
                            <Text style={[tw`text-2xl font-bold mb-2`, { color: textColor }]}>Select Card</Text>
                            <View style={tw`w-full flex-row justify-center pb-4`}>
                                <View style={[tw`w-full border h-0`, { borderColor: textColor }]} />
                            </View>
                            <AccountDetail title='Amount to pay' content={bill.amount} />
                            <ScrollView style={tw`w-full h-8/12`} contentContainerStyle={tw`w-full flex-col items-center`}>
                                {/* <CreditCard /> */}
                                <TouchableOpacity onPress={() => selectCard()}>
                                    <CreditCard />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => selectCard()}>
                                    <CreditCard />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => selectCard()}>
                                    <CreditCard />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => selectCard()}>
                                    <CreditCard />
                                </TouchableOpacity>
                            </ScrollView>
                            {/* <View style={tw`flex-col justify-center w-full h-8/12`}>
                            </View> */}
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center p-4`]}
                                onPress={() => cancelTransaction()}
                            >
                                <Text style={[tw`text-sm font-bold`, { color: textColor }]}>
                                    Pay a differemt bill instead
                                </Text>
                            </TouchableOpacity>
                        </View>}

                        {/* Final Bill Details */}
                        {showFinalDetails && <View style={tw`justify-center w-full`}>
                            <Text style={[tw`text-2xl font-bold mb-2`, { color: textColor }]}>Transaction Details</Text>
                            <View style={tw`w-full flex-row justify-center pb-4`}>
                                <View style={[tw`w-full border h-0`, { borderColor: textColor }]} />
                            </View>
                            <AccountDetail title='Bill Number' content={bill.number} />
                            <AccountDetail title='Category' content={bill.category} />
                            <AccountDetail title='Merchant' content={bill.merchant} />
                            <AccountDetail title='Address' content={bill.address} />
                            <AccountDetail title='Amount' content={bill.amount} />
                            <AccountDetail title='Card' content={"**** 8475"} />
                            <View style={tw`w-full flex-row justify-center pb-4`}>
                                <View style={[tw`w-full border h-0`, { borderColor: textColor }]} />
                            </View>
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center`, { backgroundColor: buttonBackgroundColor, padding: 16, borderRadius: 8 }]}
                                onPress={() => confirmTransaction()}
                            >
                                <Icon name={"credit-card"} size={20} color={theme === 'light' ? '#FFFFFF' : '#000000'} />
                                <Text style={[tw`text-base font-bold ml-2`, { color: buttonTextColor }]}>
                                    Pay
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center p-4`]}
                                onPress={() => cancelTransaction()}
                            >
                                <Text style={[tw`text-sm font-bold`, { color: textColor }]}>
                                    Pay a different bill instead
                                </Text>
                            </TouchableOpacity>
                        </View>}

                        {/* Transaction Status */}
                        {showTransactionStatus && <View style={tw`flex-col items-center w-full h-full justify-center`}>
                            {transactionStatus == "success" &&
                                <View style={tw`flex-col items-center`}>
                                    <Icon name={"check"} size={120} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
                                        Success
                                    </Text>
                                    <Text style={[tw`text-base font-bold mb-4`, { color: textColor }]}>
                                        Payment completed successfully.
                                    </Text>
                                    <TouchableOpacity
                                        style={[tw`flex-row justify-center items-center border-2 mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                        onPress={() => generatePDF()}
                                    >
                                        <Icon name={"share"} size={20} color={textColor} />
                                        <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                            Share Payment
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[tw`flex-row justify-center items-center p-4`]}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={[tw`text-sm font-bold`, { color: textColor }]}>
                                            Back to Home
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {transactionStatus != "success" &&
                                <View style={tw`flex-col items-center pt-16`}>
                                    <Icon name={"cross"} size={120} color={textColor} />
                                    <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
                                        Failure
                                    </Text>
                                    <Text style={[tw`text-base font-bold mb-4`, { color: textColor }]}>
                                        An error occurred, please try again later.
                                    </Text>
                                </View>
                            }
                        </View>}
                        {/* Scan QR CTA Button */}
                        {showCta && <View style={tw`mt-120`}>
                            <Text style={[tw`text-sm mb-1 pl-2`, { color: textColor }]}>
                                or you can use QR Code instead
                            </Text>
                            <TouchableOpacity
                                style={[tw`flex-row justify-center items-center border-2`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                                onPress={() => setAccountDetailsModalVisible(true)}
                            >
                                <Icon name={"camera"} size={20} color={textColor} />
                                <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                                    Scan QR Code
                                </Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
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
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-75 h-full`}>
                    <View style={[tw`w-11/12 p-5 rounded-xl h-4/6 flex-col items-center justify-start`, { backgroundColor: cardBackgroundColor }]}>
                        <View style={tw`flex-row justify-between items-center w-full mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                                Scan Bill QR Code
                            </Text>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => setAccountDetailsModalVisible(false)}
                            >
                                <Icon name="x" size={28} color={textColor} />
                            </TouchableOpacity>
                        </View>
                        {/* Camera */}
                        <View style={tw`h-4/5 w-full`}>
                            <FillToAspectRatio>
                                <RNCamera
                                    style={tw`h-full w-full`}
                                    onBarCodeRead={handleBarCodeRead}
                                    captureAudio={false}
                                />
                            </FillToAspectRatio>
                        </View>
                        <Text style={[tw`text-sm pt-2`, { color: textColor }]}>
                            Point your camera to a bill QR Code to quickly perform your transaction.
                        </Text>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

type LayoutInfo = {
    width: number,
    height: number,
};

type State = {
    layoutInfo: LayoutInfo | null | undefined,
};

type Props = {
    ratio: string,
    children: React.ReactNode,
};

class FillToAspectRatio extends React.Component<Props, State> {
    static defaultProps = {
        ratio: '4:3',
    };
    state = {
        layoutInfo: null,
    };
    handleLayout = ({ nativeEvent: { layout: { width, height } } }: { nativeEvent: { layout: LayoutInfo } }) => {
        this.setState({
            layoutInfo: { width, height },
        });
    };

    getRatio = () => {
        const { ratio } = this.props;
        const [ratioWidth, ratioHeight] = ratio.split(':').map(x => Number(x));
        return ratioHeight / ratioWidth;
    };

    render() {
        const { layoutInfo } = this.state;

        if (!layoutInfo) {
            return <View key="pre-info" onLayout={this.handleLayout} style={{
                flex: 1, overflow: 'hidden', position: 'relative'
            }} />;
        }

        const { height, width } = layoutInfo;
        let wrapperWidth;
        let wrapperHeight;
        // return <Text>lol: before </Text>
        const ratio = this.getRatio();
        if (ratio * height < width) {
            wrapperHeight = width / ratio;
            wrapperWidth = width;
        } else {
            wrapperWidth = ratio * height;
            wrapperHeight = height;
        }
        const wrapperPaddingX = (width - wrapperWidth) / 2;
        const wrapperPaddingY = (height - wrapperHeight) / 2;


        return (
            <View onLayout={this.handleLayout} style={{
                flex: 1, overflow: 'hidden', position: 'relative'
            }}>
                <View
                    style={{
                        width: wrapperWidth,
                        height: wrapperHeight,
                        marginLeft: wrapperPaddingX,
                        marginTop: wrapperPaddingY,
                    }}
                >
                    {this.props.children}
                </View>
            </View >
        );
    }
}

export default Pay;
