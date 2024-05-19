import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';
import BottomTab from '../Components/BottomTab';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';

// Type the navigation prop
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>(); // Use the navigation prop

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';
  const borderColor = theme === 'light' ? '#E0E0E0' : '#505050';

  // Function to handle logout
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <Text style={[styles.profileName, { color: textColor }]}>John Doe</Text>
          <Text style={[styles.profileEmail, { color: textColor }]}>johndoe@example.com</Text>
        </View>
        <View style={[styles.section, { backgroundColor, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={[styles.sectionItemText, { color: textColor }]}>Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={[styles.sectionItemText, { color: textColor }]}>Change Password</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { backgroundColor, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Settings</Text>
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={[styles.sectionItemText, { color: textColor }]}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={[styles.sectionItemText, { color: textColor }]}>Privacy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomTab navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
  },
  section: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionItem: {
    paddingVertical: 15,
  },
  sectionItemText: {
    fontSize: 16,
  },
  logoutSection: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
