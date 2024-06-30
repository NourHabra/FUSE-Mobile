import React, { useEffect, useState } from 'react';
import { View, Text, BackHandler, ScrollView, StatusBar, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import AccountCard from '../Components/AccountCard';
// import Beneficiaries from '../Components/Beneficiaries'; // Uncomment if needed
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

const Splashscreen = ({ navigation }: { navigation: any }) => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMerchant, setIsMerchant] = useState(true);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonPress
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleBackButtonPress = () => {
        const navigationState = navigation.getState();
        const currentRouteName = navigationState.routes[navigationState.index].name;

        if (currentRouteName === 'Splashscreen') {
            return true;
        }

        return false;
    };

    // Define the background color for light and dark themes
    const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030'; // Custom very dark blue
    const textColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
    const iconColorClass = theme === 'light' ? 'black' : 'white';
    const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

    // Sample data for cards
    const cards = [
        { id: '1', type: 'Checking', balance: '$10,546.70' },
        { id: '2', type: 'Savings', balance: '$5,123.45' },
        { id: '3', type: 'Business', balance: '$20,789.00' },
    ];

    const cardWidth = Dimensions.get('window').width * 0.85;
    const cardSpacing = 10; // Adjust this value to control spacing between cards

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + cardSpacing));
        setCurrentIndex(index);
    };

    return (
        <View style={[tw`flex-1`, { backgroundColor }]}>
            <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
            <View style={tw`h-full w-full items-center justify-center`}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }}
                >
                    <Text
                        style={[
                            tw`text-4xl font-bold mb-4`,
                            { color: theme === 'light' ? '#000000' : '#FFFFFF' },
                        ]}
                    >FUSE</Text>
                    <ActivityIndicator size="large" color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Splashscreen;
