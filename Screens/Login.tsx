import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../ThemeContext';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type the navigation prop
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { theme } = useTheme();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);

  // Conditional styling based on theme
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';
  const borderColor = theme === 'light' ? '#CCCCCC' : '#444444';
  const placeholderColor = theme === 'light' ? '#999999' : '#A0A0A0';
  const buttonColor = theme === 'light' ? '#181E20' : '#ADD8E6';
  const buttonTextColor = theme === 'light' ? '#FFFFFF' : '#181E20';
  const linkColor = theme === 'light' ? '#181E20' : '#ADD8E6';

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (savedBiometrics) {
        const useBiometrics = await AsyncStorage.getItem('useBiometrics');
        setUseBiometrics(useBiometrics === 'true');
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) return Alert.alert('Biometric record not found', 'Please login with your password');

    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      fallbackLabel: 'Enter Password',
    });

    if (success) {
      handleLogin();
    } else {
      Alert.alert('Authentication failed', 'Please try again');
    }
  };

  const handleLogin = async () => {
    // Assuming the login credentials are correct and login is successful
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <StatusBar backgroundColor={backgroundColor} barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={{ width: '100%', maxWidth: 400, backgroundColor, borderRadius: 8, padding: 24, borderWidth: 1, borderColor }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: textColor, marginBottom: 32 }}>
          Sign In
        </Text>

        <TextInput
          style={{ backgroundColor: '#F0F0F0', borderColor, padding: 16, borderRadius: 8, marginBottom: 20, fontSize: 18, color: textColor }}
          placeholder="Email"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          placeholderTextColor={placeholderColor}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderColor, borderRadius: 8, marginBottom: 32 }}>
          <TextInput
            style={{ flex: 1, padding: 16, fontSize: 18, color: textColor }}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            textContentType="password"
            autoComplete="password"
            placeholderTextColor={placeholderColor}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ padding: 8 }}>
            <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={placeholderColor} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: buttonColor, padding: 16, borderRadius: 8, alignItems: 'center' }}
          onPress={handleLogin}
        >
          <Text style={{ color: buttonTextColor, fontSize: 20, fontWeight: 'bold' }}>
            Login
          </Text>
        </TouchableOpacity>

        {isBiometricSupported && useBiometrics && (
          <TouchableOpacity
            style={{ marginTop: 16, padding: 16, borderRadius: 8, alignItems: 'center', borderColor, borderWidth: 1 }}
            onPress={handleBiometricAuth}
          >
            <Text style={{ color: textColor, fontSize: 16 }}>
              Login with Biometrics
            </Text>
          </TouchableOpacity>
        )}

        <Text style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: textColor }}>
          Don't have an account? 
          <Text style={{ color: linkColor, fontWeight: 'bold' }} onPress={() => navigation.navigate('Signup')}>
            {' '}Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;
