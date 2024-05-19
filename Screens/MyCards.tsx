// FUSE-EXPO/Screens/MyCard.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';

const MyCard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#1F1F1F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: textColor }]}>My Card Screen</Text>
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
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default MyCard;
