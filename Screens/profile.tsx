import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Modal, TextInput, Switch, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../ThemeContext';
import BottomTab from '../Components/BottomTab';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

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
  const [loading, setLoading] = useState(false);

  const oldPinRefs = useRef<(TextInput | null)[]>([]);
  const newPinRefs = useRef<(TextInput | null)[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);

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
          onPress: () => { },
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
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';
  const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
  const buttonColor = theme === 'light' ? '#028174' : '#65e991';
  const buttonTextColor = theme === 'light' ? '#FFFFFF' : '#181E20';
  const placeholderColor = theme === 'light' ? '#999999' : '#A0A0A0';

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={[tw`w-full mb-4 p-4 rounded-lg`, { backgroundColor: cardBackgroundColor }]}>
      <Text style={[tw`text-xl font-bold mb-2`, { color: textColor }]}>{title}</Text>
      {children}
    </View>
  );

  const ProfileButton = ({ title, onPress }: { title: string, onPress: () => void }) => (
    <TouchableOpacity style={tw`py-2`} onPress={onPress}>
      <Text style={[tw`text-lg`, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
      <View style={tw`flex-1 p-4`}>
        <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>Profile</Text>
        <ScrollView contentContainerStyle={tw`flex-grow items-center p-3`}>
          <View style={tw`items-center mb-4`}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={tw`w-20 h-20 rounded-full mb-2`}
            />
            <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>{user?.name}</Text>
            <Text style={[tw`text-lg`, { color: placeholderColor }]}>{user?.email}</Text>
          </View>

          <ProfileSection title="Account">
            <ProfileButton title="Personal Information" onPress={() => setPersonalInfoModalVisible(true)} />
            <ProfileButton title="Change Password" onPress={() => setChangePasswordModalVisible(true)} />
          </ProfileSection>

          <ProfileSection title="Settings">
            <ProfileButton title="Notifications" onPress={() => {/* Handle notifications */ }} />
            <ProfileButton title="Privacy" onPress={() => setOldPinModalVisible(true)} />
            <View style={tw`py-2 flex-row justify-between items-center`}>
              <Text style={[tw`text-lg`, { color: textColor }]}>Dark Theme</Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                trackColor={{ false: placeholderColor, true: buttonColor }}
                thumbColor={theme === 'dark' ? buttonTextColor : '#f4f3f4'}
              />
            </View>
            <View style={tw`py-2 flex-row justify-between items-center`}>
              <Text style={[tw`text-lg`, { color: textColor }]}>Biometric Login</Text>
              <Switch
                value={useBiometrics}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: placeholderColor, true: buttonColor }}
                thumbColor={useBiometrics ? buttonTextColor : '#f4f3f4'}
              />
            </View>
          </ProfileSection>

          <TouchableOpacity
            style={[tw`w-full py-3 items-center rounded-lg`, { backgroundColor: '#FF3B30' }]}
            onPress={handleLogout}
          >
            <Text style={tw`text-white text-lg font-bold`}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <BottomTab navigation={navigation} />

      {/* Modals */}
      {/* Personal Information Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={personalInfoModalVisible}
        onRequestClose={() => setPersonalInfoModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setPersonalInfoModalVisible(false)}
            >
              <Icon name="close" size={28} color={textColor} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <View style={tw`flex-row justify-between items-center mb-4 p-2 border-b border-gray-300`}>
                <Text style={[tw`text-lg`, { color: textColor }]}>Name: {user?.name}</Text>
                <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
                  <Icon name="pencil" size={24} color={buttonColor} />
                </TouchableOpacity>
              </View>
              <View style={tw`flex-row justify-between items-center mb-4 p-2 border-b border-gray-300`}>
                <Text style={[tw`text-lg`, { color: textColor }]}>Email: {user?.email}</Text>
                <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
                  <Icon name="pencil" size={24} color={buttonColor} />
                </TouchableOpacity>
              </View>
              <View style={tw`flex-row justify-between items-center p-2 border-b border-gray-300`}>
                <Text style={[tw`text-lg`, { color: textColor }]}>Phone: (123) 456-7890</Text>
                <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
                  <Icon name="pencil" size={24} color={buttonColor} />
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
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setChangePasswordModalVisible(false)}
            >
              <Icon name="close" size={28} color={textColor} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <TextInput
                style={[tw`mb-4 p-3 rounded-lg`, { backgroundColor: cardBackgroundColor, color: textColor }]}
                placeholder="Current Password"
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              <TextInput
                style={[tw`mb-4 p-3 rounded-lg`, { backgroundColor: cardBackgroundColor, color: textColor }]}
                placeholder="New Password"
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              <TextInput
                style={[tw`mb-4 p-3 rounded-lg`, { backgroundColor: cardBackgroundColor, color: textColor }]}
                placeholder="Confirm New Password"
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              <TouchableOpacity style={[tw`py-3 rounded-lg items-center`, { backgroundColor: buttonColor }]} onPress={() => { /* Handle password change */ }}>
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
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setOldPinModalVisible(false)}
            >
              <Icon name="close" size={28} color={textColor} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <Text style={[tw`text-lg font-bold mb-4`, { color: textColor }]}>Enter Old PIN</Text>
              <View style={tw`flex-row justify-center mb-4`}>
                {[0, 1, 2, 3].map((_, index) => (
                  <TextInput
                    key={index}
                    style={[tw`w-12 h-12 mx-1 text-center text-lg rounded-lg`, { backgroundColor: cardBackgroundColor, color: textColor }]}
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
              <TouchableOpacity style={[tw`py-3 rounded-lg items-center`, { backgroundColor: buttonColor }]} onPress={() => {
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
          <View style={[tw`w-11/12 p-5 rounded-lg`, { backgroundColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }]}>
            <TouchableOpacity
              style={tw`absolute top-2 right-2 p-2`}
              onPress={() => setNewPinModalVisible(false)}
            >
              <Icon name="close" size={28} color={textColor} />
            </TouchableOpacity>
            <View style={tw`mb-4 mt-8`}>
              <Text style={[tw`text-lg font-bold mb-4`, { color: textColor }]}>Enter New PIN</Text>
              <View style={tw`flex-row justify-center mb-4`}>
                {[0, 1, 2, 3].map((_, index) => (
                  <TextInput
                    key={index}
                    style={[tw`w-12 h-12 mx-1 text-center text-lg rounded-lg`, { backgroundColor: cardBackgroundColor, color: textColor }]}
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
              <TouchableOpacity
                style={[tw`py-3 rounded-lg items-center`, { backgroundColor: buttonColor }]}
                onPress={() => {
                  setLoading(true);
                  // Simulate PIN change process
                  setTimeout(() => {
                    setNewPinModalVisible(false);
                    setLoading(false);
                    Alert.alert('Success', 'PIN changed successfully');
                  }, 2000);
                }}
              >
                {loading ? (
                  <ActivityIndicator color={buttonTextColor} />
                ) : (
                  <Text style={[tw`text-lg font-bold`, { color: buttonTextColor }]}>Change PIN</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
