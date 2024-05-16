import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert, Platform } from 'react-native';
import NfcManager, { NfcTech, NfcEvents, TagEvent, Ndef } from 'react-native-nfc-manager';

const NfcFunctionality = () => {
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);
  const [tagDetected, setTagDetected] = useState<boolean>(false);
  const [tagDetails, setTagDetails] = useState<string>('');

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

  const handleCheckAgain = async () => {
    setTagDetected(false);
    setTagDetails('');
    await NfcManager.unregisterTagEvent();
    setupTagDetection();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>NFC Functionality</Text>
      <Text style={styles.status}>
        {nfcSupported ? (nfcEnabled ? (tagDetected ? 'NFC Tag Detected' : 'No NFC Tag Detected') : 'NFC is not enabled') : 'NFC is not supported'}
      </Text>
      {tagDetected && (
        <View style={styles.tagDetailsContainer}>
          <Text style={styles.subHeader}>Tag Details:</Text>
          <Text style={styles.details}>{tagDetails}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Write to NFC Tag" onPress={() => {}} color="#2196F3" />
        <Button title="Format NFC Tag" onPress={() => {}} color="#FF9800" />
        <Button title="Check Again" onPress={handleCheckAgain} color="#F44336" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  tagDetailsContainer: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default NfcFunctionality;
