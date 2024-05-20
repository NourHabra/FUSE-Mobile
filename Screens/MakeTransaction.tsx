import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech, NfcEvents, TagEvent } from 'react-native-nfc-manager';
import QRCodeStyled from 'react-native-qrcode-styled';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import BottomTab from '../Components/BottomTab'; // Import BottomTab
import { useTheme } from '../ThemeContext'; // Import useTheme
import tw from 'twrnc'; // Import twrnc

const MakeTransaction: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mode, setMode] = useState<'send' | 'request' | null>(null);
  const [requestMethod, setRequestMethod] = useState<'qr' | 'nfc' | null>(null);
  const [scan, setScan] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);
  const [tagDetected, setTagDetected] = useState<boolean>(false);
  const [tagDetails, setTagDetails] = useState<string>('');
  const { theme } = useTheme(); // Use the theme

  useEffect(() => {
    async function initNfc() {
      const supported = await NfcManager.isSupported();
      setNfcSupported(supported);
      if (!supported) {
        return;
      }

      await NfcManager.start();
      const enabled = await NfcManager.isEnabled();
      setNfcEnabled(enabled);

      setupTagDetection();
    }

    initNfc();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
    };
  }, []);

  const setupTagDetection = async () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
      console.log('NFC Tag Detected:', tag);
      setTagDetected(true);
      setTagDetails(JSON.stringify(tag, null, 2)); // Store tag details in state
      if (Platform.OS === 'ios') {
        NfcManager.setAlertMessageIOS('NFC tag detected!');
      }
      NfcManager.unregisterTagEvent().catch(() => 0);
    });

    await NfcManager.registerTagEvent();
  };

  const handleBarCodeRead = (e: BarCodeReadEvent) => {
    setResult(e.data);
    setScan(false);
    Alert.alert("QR Code Scanned", `QR Code data: ${e.data}`);
  };

  const handleCheckAgain = async () => {
    setTagDetected(false);
    setTagDetails('');
    await NfcManager.unregisterTagEvent();
    setupTagDetection();
  };

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';
  const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
  const buttonBackgroundColor = theme === 'light' ? 'bg-[#ADD8E6]' : 'bg-[#ADD8E6]'; // Updated color

  const CustomButton = ({ title, onPress }: { title: string, onPress: () => void }) => (
    <TouchableOpacity
      style={tw`w-full py-3 my-2 rounded ${buttonBackgroundColor} items-center`}
      onPress={onPress}
    >
      <Text style={tw`text-white text-lg`}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center p-5`}>
        <Text style={tw`text-2xl font-bold mb-5 ${textColor}`}>Make a Transaction</Text>
        {!mode && (
          <View style={tw`w-full mt-5`}>
            <CustomButton title="Send Payment" onPress={() => setMode('send')} />
            <CustomButton title="Request Payment" onPress={() => setMode('request')} />
          </View>
        )}
        {mode === 'request' && !requestMethod && (
          <View style={tw`w-full mt-5`}>
            <CustomButton title="Request via QR Code" onPress={() => setRequestMethod('qr')} />
            <CustomButton title="Request via NFC" onPress={() => setRequestMethod('nfc')} />
          </View>
        )}
        {mode === 'request' && requestMethod === 'qr' && (
          <View style={tw`items-center`}>
            <Text style={tw`text-xl font-semibold mb-2 ${textColor}`}>Request Payment via QR Code</Text>
            <QRCodeStyled
              data={'1234567890abcdefghijklmnopqrstuvwxyz'}
              style={{ backgroundColor: 'white' }}
              padding={20}
              pieceSize={8}
              pieceCornerType='rounded'
              pieceBorderRadius={3}
              isPiecesGlued={true}
            />
          </View>
        )}
        {mode === 'request' && requestMethod === 'nfc' && (
          <View style={tw`items-center`}>
            <Text style={tw`text-xl font-semibold mb-2 ${textColor}`}>Request Payment via NFC</Text>
            {nfcSupported && nfcEnabled && (
              <View style={tw`mt-5 items-center`}>
                <Text style={tw`text-lg mb-2 ${textColor}`}>
                  {tagDetected ? 'NFC Tag Detected' : 'Waiting for NFC Tag...'}
                </Text>
                {tagDetected && (
                  <View style={[tw`w-full p-2 rounded mb-5`, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={tw`text-xl font-semibold mb-2 ${textColor}`}>Tag Details:</Text>
                    <Text style={tw`text-lg ${textColor}`}>{tagDetails}</Text>
                  </View>
                )}
                <CustomButton title="Check NFC Again" onPress={handleCheckAgain} />
              </View>
            )}
          </View>
        )}
        {mode === 'send' && (
          <View style={tw`items-center`}>
            <Text style={tw`text-xl font-semibold mb-2 ${textColor}`}>Send Payment</Text>
            {scan ? (
              <RNCamera
                style={tw`flex-1 justify-end items-center h-100 w-full`}
                onBarCodeRead={handleBarCodeRead}
                captureAudio={false}
              >
                <Text style={tw`bg-white mb-2 text-center p-2 text-lg`}>Scanning for QR Codes...</Text>
              </RNCamera>
            ) : (
              <View style={tw`w-full mt-5`}>
                <CustomButton title="Start QR Scanning" onPress={() => setScan(true)} />
                <Text style={tw`mt-5 text-lg ${textColor}`}>Scanned Result: {result}</Text>
              </View>
            )}
            {nfcSupported && nfcEnabled && (
              <View style={tw`mt-5 items-center`}>
                <Text style={tw`text-lg mb-2 ${textColor}`}>
                  {tagDetected ? 'NFC Tag Detected' : 'No NFC Tag Detected'}
                </Text>
                {tagDetected && (
                  <View style={[tw`w-full p-2 rounded mb-5`, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={tw`text-xl font-semibold mb-2 ${textColor}`}>Tag Details:</Text>
                    <Text style={tw`text-lg ${textColor}`}>{tagDetails}</Text>
                  </View>
                )}
                <CustomButton title="Check NFC Again" onPress={handleCheckAgain} />
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <BottomTab navigation={navigation} />
    </View>
  );
};

export default MakeTransaction;
