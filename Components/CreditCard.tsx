import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreditCard = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.cardText}>John Doe</Text>
        <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
        <Text style={styles.cardText}>Expires 12/25</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 300,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5264AE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cardNumber: {
    fontSize: 21,
    letterSpacing: 2,
    marginVertical: 15,
  },
});

export default CreditCard;
