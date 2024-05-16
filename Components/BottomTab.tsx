import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BottomTabProps = {
  navigation: any;
};

const BottomTab: React.FC<BottomTabProps> = ({ navigation }) => {
  // Handle navigation
  const handlePress = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('Home')}>
        <Ionicons name="home" size={24} color="white" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('NfcFunctionality')}>
        <Ionicons name="wifi" size={24} color="white" />
        <Text style={styles.label}>NFC</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('QrCodeFunctionality')}>
        <Ionicons name="qr-code" size={24} color="white" />
        <Text style={styles.label}>QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    width: '90%',
    backgroundColor: '#1E90FF',
    borderRadius: 35,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  label: {
    marginTop: 5,
    color: 'white',
    fontSize: 12,
  },
});

export default BottomTab;
