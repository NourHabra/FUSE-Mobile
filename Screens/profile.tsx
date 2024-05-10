import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';

const Profile = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: textColor }]}>Profile!</Text>
      </View>
      <BottomTab navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Profile;
