import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useTheme } from '../ThemeContext'; // Adjust the import path to where your ThemeContext is defined
import * as Font from 'expo-font';
import tw from 'twrnc';
import BalanceDisplay from './BalanceDisplay';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';



const AccountCard = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = async () => {
        try {
            await Font.loadAsync({
                SometypeMono: require("../assets/fonts/SometypeMono.ttf"),
            });
            setFontsLoaded(true);
        } catch (error) {
            console.error("Font loading error:", error);
        }
    };

    useEffect(() => {
        loadFonts();
    }, []);

    const { theme } = useTheme(); // Using the theme from ThemeContext using useTheme hook

    // Always use the '09.png' image
    const imageSource = require('../assets/09.png');
    // Text color is always white
    const textColor = '#FFFFFF';

    return (
        <View style={[tw`flex-col p-4 rounded-3xl font-bold w-100 h-1/3 justify-between bg-lime-900`]}>
            <View style={tw`flex-row w-100`}>
                <Text style={tw`text-white text-lg`}>Checking</Text>
            </View>
            <View style={tw`flex-col w-100`}>
                <Text style={tw`text-white text-md`}>Current Balance</Text>
                <Text style={tw`text-white font-bold text-3xl`}>$10,546.70</Text>
            </View>
            <TouchableOpacity onPress={() => console.log("View Acc Tapped")} style={tw`flex-row w-100 justify-end items-center px-7`}>
                <Text style={tw`text-white text-lg pr-2`}>View Account</Text>
                <Icon name="arrow-right-circle" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    chip: {
        height: "50%",
        color: "black",
        width: "50%",
        marginBottom: -100,
    },
    cardText: {
        fontSize: 18,
        letterSpacing: 2,
        marginVertical: 15,
    },
    cardNumber: {
        fontFamily: "SometypeMono",
        fontSize: 24,
        letterSpacing: 1,
        marginTop: 100
    },
    flexRow: {
        flexDirection: "row",
        width: "80%",
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    expirationText: {
        flexDirection: "row",
        alignItems: "center",
    },
    smallLabel: {
        fontSize: 12,
        marginRight: 2
    },
});

export default AccountCard;
