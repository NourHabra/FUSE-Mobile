import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import NfcManager, { NfcTech, NfcEvents, TagEvent } from 'react-native-nfc-manager';

const ThisATest = () => {
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
    }

    initNfc();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {nfcSupported ? (nfcEnabled ? (tagDetected ? 'NFC Tag Detected' : 'No NFC Tag Detected') : 'NFC is not enabled') : 'NFC is not supported'}
      </Text>
      {tagDetected && (
        <Text style={styles.details}>
          Tag Details: {tagDetails}
        </Text>
      )}
      <Button
        title="Check Again"
        onPress={async () => {
          setTagDetected(false);
          setTagDetails(''); // Clear previous tag details
          await NfcManager.unregisterTagEvent();
          await NfcManager.registerTagEvent();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center'
  },
});

export default ThisATest;
