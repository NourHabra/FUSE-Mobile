import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
      <TouchableOpacity onPress={() => handlePress('Home')}>
        <View>
          <Ionicons name="home" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('ThisATest')}>
        <View>
          <Ionicons name="search" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Home')}>
        <View>
          <Ionicons name="person" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    width: '90%',
    backgroundColor: '#5AB3FF',
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default BottomTab;
