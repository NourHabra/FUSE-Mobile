import React, { useState } from 'react';
import { StatusBar, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../ThemeContext'; // Import useTheme

// Type the navigation prop
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { theme } = useTheme(); // Use theme from context

  // Conditional styling based on theme
  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';
  const borderColor = theme === 'light' ? '#CCCCCC' : '#444444';
  const placeholderColor = theme === 'light' ? '#999999' : '#A0A0A0';
  const buttonColor = theme === 'light' ? '#181E20' : '#ADD8E6'; // Button color based on theme
  const linkColor = theme === 'light' ? '#181E20' : '#ADD8E6'; // Link color based on theme

  // Function to handle login
  const handleLogin = () => {
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
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
            Login
          </Text>
        </TouchableOpacity>

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
