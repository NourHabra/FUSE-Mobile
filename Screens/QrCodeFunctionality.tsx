import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';

const QrCodeFunctionality: React.FC = () => {
  const [scan, setScan] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const handleBarCodeRead = (e: BarCodeReadEvent) => {
    setResult(e.data);
    setScan(false);
    Alert.alert("QR Code Scanned", `QR Code data: ${e.data}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR Code Functionality</Text>
      <QRCode
        value="12345678"
        size={200}
        color="black"
        backgroundColor="white"
      />
      {scan ? (
        <RNCamera
          style={styles.preview}
          onBarCodeRead={handleBarCodeRead}
          captureAudio={false}
        >
          <Text style={styles.camText}>Scanning for QR Codes...</Text>
        </RNCamera>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Start Scanning" onPress={() => setScan(true)} />
          <Text style={styles.resultText}>Scanned Result: {result}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 400,
    width: '100%'
  },
  camText: {
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    padding: 10,
    fontSize: 20
  },
  buttonContainer: {
    marginTop: 20,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
  }
});

export default QrCodeFunctionality;
