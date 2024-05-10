import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, BackHandler, Alert } from 'react-native';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

const ThisATest = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const [nfcTag, setNfcTag] = useState<string | null>(null);

  useEffect(() => {
    NfcManager.start();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress
    );

    return () => {
      backHandler.remove();
      NfcManager.cancelTechnologyRequest();
    };
  }, [navigation]);

  const handleBackButtonPress = () => {
    const navigationState = navigation.getState();
    const currentRouteName = navigationState.routes[navigationState.index].name;

    if (currentRouteName === 'Home') {
      return true;
    }

    return false;
  };

  const readNfcData = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setNfcTag(JSON.stringify(tag));
      await NfcManager.cancelTechnologyRequest();
    } catch (error) {
      console.warn('Failed to read NFC tag', error);
      setNfcTag(null);
    }
  };

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: textColor }]}>NFC Data: {nfcTag || "No tag read"}</Text>
        <Button title="Read NFC Tag" onPress={readNfcData} />
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
});

export default ThisATest;
