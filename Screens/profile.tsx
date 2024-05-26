import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Modal, TextInput, Switch, Alert } from 'react-native';
import { useTheme } from '../ThemeContext';
import BottomTab from '../Components/BottomTab';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [oldPinModalVisible, setOldPinModalVisible] = useState(false);
  const [newPinModalVisible, setNewPinModalVisible] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [useBiometrics, setUseBiometrics] = useState(false);

  const oldPinRefs = useRef<(TextInput | null)[]>([]);
  const newPinRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    (async () => {
      const useBiometrics = await AsyncStorage.getItem('useBiometrics');
      setUseBiometrics(useBiometrics === 'true');
    })();
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    Alert.alert(
      'Enable Biometric Login',
      `Are you sure you want to ${value ? 'enable' : 'disable'} biometric login?`,
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setUseBiometrics(value);
            await AsyncStorage.setItem('useBiometrics', value.toString());
          },
        },
      ],
      { cancelable: false }
    );
  };

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';
  const buttonBackgroundColor = theme === 'light' ? '#181E20' : '#94B9C5';
  const buttonTextColor = theme === 'light' ? '#FFFFFF' : '#181E20';

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`${textColor} text-2xl font-bold mb-4`}>Profile</Text>
        <ScrollView contentContainerStyle={tw`flex-grow items-center p-3`}>
          <View style={tw`items-center mb-4`}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={tw`w-20 h-20 rounded-full mb-2`}
            />
            <Text style={tw`text-2xl font-bold ${textColor}`}>John Doe</Text>
            <Text style={tw`text-lg text-gray-500`}>johndoe@example.com</Text>
          </View>
          <View style={[tw`w-full mb-4 p-4 rounded-lg`, { elevation: 3, backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040' }]}>
            <Text style={tw`text-xl font-bold mb-2 ${textColor}`}>Account</Text>
            <TouchableOpacity style={tw`py-2`} onPress={() => setPersonalInfoModalVisible(true)}>
              <Text style={tw`${textColor} text-lg`}>Personal Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`py-2`} onPress={() => setChangePasswordModalVisible(true)}>
              <Text style={tw`${textColor} text-lg`}>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={[tw`w-full mb-4 p-4 rounded-lg`, { elevation: 3, backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040' }]}>
            <Text style={tw`text-xl font-bold mb-2 ${textColor}`}>Settings</Text>
            <TouchableOpacity style={tw`py-2`}>
              <Text style={tw`${textColor} text-lg`}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`py-2`} onPress={() => setOldPinModalVisible(true)}>
              <Text style={tw`${textColor} text-lg`}>Privacy</Text>
            </TouchableOpacity>
            <View style={tw`py-2 flex-row justify-between items-center`}>
              <Text style={tw`${textColor} text-lg`}>Dark Theme</Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              />
            </View>
            <View style={tw`py-2 flex-row justify-between items-center`}>
              <Text style={tw`${textColor} text-lg`}>Biometric Login</Text>
              <Switch
                value={useBiometrics}
                onValueChange={handleBiometricToggle}
              />
            </View>
          </View>
          <View style={tw`w-full mb-4 p-4`}>
            <TouchableOpacity style={tw`bg-red-600 py-3 items-center rounded-lg`} onPress={handleLogout}>
              <Text style={tw`text-white text-lg font-bold`}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomTab navigation={navigation} />

      {/* Personal Information Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={personalInfoModalVisible}
        onRequestClose={() => setPersonalInfoModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setPersonalInfoModalVisible(false)}
            >
              <Icon name="close" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <View style={tw`flex-row justify-between items-center mb-4 p-2 border-b border-gray-300`}>
                <Text style={[tw`text-lg`, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>Name: John Doe</Text>
                <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
                  <Icon name="edit" size={24} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
              <View style={tw`flex-row justify-between items-center mb-4 p-2 border-b border-gray-300`}>
                <Text style={[tw`text-lg`, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>Email: johndoe@example.com</Text>
                <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
                  <Icon name="edit" size={24} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
              <View style={tw`flex-row justify-between items-center p-2 border-b border-gray-300`}>
                <Text style={[tw`text-lg`, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>Phone: (123) 456-7890</Text>
                <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
                  <Icon name="edit" size={24} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setChangePasswordModalVisible(false)}
            >
              <Icon name="close" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <TextInput
                style={[tw`mb-4 p-2 rounded-lg`, { backgroundColor: theme === 'light' ? '#F0F0F0' : '#505050', color: theme === 'light' ? '#000000' : '#FFFFFF' }]}
                placeholder="Current Password"
                placeholderTextColor={theme === 'light' ? '#A0A0A0' : '#A0A0A0'}
                secureTextEntry
              />
              <TextInput
                style={[tw`mb-4 p-2 rounded-lg`, { backgroundColor: theme === 'light' ? '#F0F0F0' : '#505050', color: theme === 'light' ? '#000000' : '#FFFFFF' }]}
                placeholder="New Password"
                placeholderTextColor={theme === 'light' ? '#A0A0A0' : '#A0A0A0'}
                secureTextEntry
              />
              <TextInput
                style={[tw`mb-4 p-2 rounded-lg`, { backgroundColor: theme === 'light' ? '#F0F0F0' : '#505050', color: theme === 'light' ? '#000000' : '#FFFFFF' }]}
                placeholder="Confirm New Password"
                placeholderTextColor={theme === 'light' ? '#A0A0A0' : '#A0A0A0'}
                secureTextEntry
              />
              <TouchableOpacity style={[tw`py-3 rounded-lg items-center`, { backgroundColor: buttonBackgroundColor }]} onPress={() => { /* Handle password change */ }}>
                <Text style={[tw`text-lg font-bold`, { color: buttonTextColor }]}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Old PIN Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={oldPinModalVisible}
        onRequestClose={() => setOldPinModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setOldPinModalVisible(false)}
            >
              <Icon name="close" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <Text style={[tw`text-lg font-bold mb-4`, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>Enter Old PIN</Text>
              <View style={tw`flex-row justify-center mb-4`}>
                {[0, 1, 2, 3].map((_, index) => (
                  <TextInput
                    key={index}
                    style={[tw`w-12 h-12 mx-1 text-center text-lg rounded-lg`, { backgroundColor: theme === 'light' ? '#F0F0F0' : '#505050', color: theme === 'light' ? '#000000' : '#FFFFFF' }]}
                    maxLength={1}
                    keyboardType="numeric"
                    secureTextEntry
                    value={oldPin[index] || ''}
                    onChangeText={(text) => {
                      const newPin = oldPin.split('');
                      newPin[index] = text;
                      setOldPin(newPin.join(''));
                      if (text && index < 3 && oldPinRefs.current[index + 1]) {
                        oldPinRefs.current[index + 1]?.focus();
                      }
                    }}
                    ref={(input) => { oldPinRefs.current[index] = input; }}
                  />
                ))}
              </View>
              <TouchableOpacity style={[tw`py-3 rounded-lg items-center`, { backgroundColor: buttonBackgroundColor }]} onPress={() => {
                setOldPinModalVisible(false);
                setNewPinModalVisible(true);
              }}>
                <Text style={[tw`text-lg font-bold`, { color: buttonTextColor }]}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New PIN Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newPinModalVisible}
        onRequestClose={() => setNewPinModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setNewPinModalVisible(false)}
            >
              <Icon name="close" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <Text style={[tw`text-lg font-bold mb-4`, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>Enter New PIN</Text>
              <View style={tw`flex-row justify-center mb-4`}>
                {[0, 1, 2, 3].map((_, index) => (
                  <TextInput
                    key={index}
                    style={[tw`w-12 h-12 mx-1 text-center text-lg rounded-lg`, { backgroundColor: theme === 'light' ? '#F0F0F0' : '#505050', color: theme === 'light' ? '#000000' : '#FFFFFF' }]}
                    maxLength={1}
                    keyboardType="numeric"
                    secureTextEntry
                    value={newPin[index] || ''}
                    onChangeText={(text) => {
                      const newPinArray = newPin.split('');
                      newPinArray[index] = text;
                      setNewPin(newPinArray.join(''));
                      if (text && index < 3 && newPinRefs.current[index + 1]) {
                        newPinRefs.current[index + 1]?.focus();
                      }
                    }}
                    ref={(input) => { newPinRefs.current[index] = input; }}
                  />
                ))}
              </View>
              <TouchableOpacity style={[tw`py-3 rounded-lg items-center`, { backgroundColor: buttonBackgroundColor }]} onPress={() => {
                setNewPinModalVisible(false);
                // Handle PIN change logic here
              }}>
                <Text style={[tw`text-lg font-bold`, { color: buttonTextColor }]}>Change PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
