import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../ThemeContext';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAesKey, encryptAesKey, encryptData, decryptData } from '../crypto-utils';
import axios from 'axios';
import TextInput from "../Components/TextInput";
import tw from 'twrnc';



// Type the navigation prop
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const baseUrl = 'https://fuse-backend-x7mr.onrender.com'; // Replace with your actual base URL

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { theme } = useTheme();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [aesKey, setAesKey] = useState('');
  const [loading, setLoading] = useState(false);

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
      // handleLogin();
    } else {
      Alert.alert('Authentication failed', 'Please try again');
    }
  };

  const handleLoginStep1 = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/key/publicKey`, { email });
      const { publicKey } = response.data;
      console.log(publicKey);


      const aesKey = generateAesKey();
      setAesKey(aesKey);

      const encryptedAesKey = encryptAesKey(publicKey, aesKey);

      const response2 = await axios.post(`${baseUrl}/key/setAESkey`, { email, encryptedAesKey });
      if (response2.status === 200) {
        console.log("Moving to step 2");
        setStep(2);
      }
      setStep(2);
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate login process');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginStep2 = async () => {
    setLoading(true);
    try {
      const payload = encryptData({ email, password }, aesKey);
      const response = await axios.post(`${baseUrl}/auth/login`, { email, payload });
      const decryptedPayload = decryptData(response.data.payload, aesKey);
      console.log(decryptedPayload.jwt);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <StatusBar backgroundColor={backgroundColor} barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={{ width: '100%', maxWidth: 400, backgroundColor, borderRadius: 8, padding: 24, borderWidth: 1, borderColor }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: textColor, marginBottom: 32 }}>
          Login
        </Text>

        {step === 1 ? (
          <>
            <TextInput
              style={[tw`flex-row mb-4`]}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
            />
            <TouchableOpacity
              style={{ backgroundColor: buttonColor, padding: 16, borderRadius: 8, alignItems: 'center' }}
              onPress={handleLoginStep1}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={buttonTextColor} />
              ) : (
                <Text style={{ color: buttonTextColor, fontSize: 20, fontWeight: 'bold' }}>
                  Next
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={[tw`flex-row mb-4 items-center`]}>
              <TextInput
                style={[tw`flex-row w-grow`]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                textContentType="password"
                autoComplete="password"
                placeholder='Password'
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ padding: 8 }}>
                <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={placeholderColor} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: buttonColor, padding: 16, borderRadius: 8, alignItems: 'center' }}
              onPress={handleLoginStep2}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={buttonTextColor} />
              ) : (
                <Text style={{ color: buttonTextColor, fontSize: 20, fontWeight: 'bold' }}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

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
