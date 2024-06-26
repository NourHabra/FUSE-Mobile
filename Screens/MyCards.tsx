import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Modal, TextInput as DefaultTextInput, Keyboard, Platform, TextInputProps, ActivityIndicator, } from 'react-native';
import tw from 'twrnc';
import BottomTab from '../Components/BottomTab';
import { useTheme } from '../ThemeContext';
import CreditCard from '../Components/CreditCard';
import Icon from 'react-native-vector-icons/Feather';
import AccountCard from '../Components/AccountCard';

const TextInput = ({
  placeholderTextColor,
  ...props
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleEndEditing = () => {
    setIsFocused(false);
  };

  return (
    <DefaultTextInput
      {...props}
      onFocus={handleFocus}
      onEndEditing={handleEndEditing}
      style={[
        tw`bg-neutral-100 dark:bg-neutral-900 border border-black/20 dark:border-white/20 rounded-md h-12 px-4 text-neutral-950 dark:text-neutral-50`,
        isFocused && Platform.OS !== "web" ? tw`border-blue-500` : {},
        props.style,
      ]}
      placeholderTextColor={
        placeholderTextColor || tw.color("text-neutral-500")
      }
    />
  );
};

const MyCards: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#FFFFFF' : '#303030';
  const textColor = theme === 'light' ? '#333333' : '#DDDDDD';
  const cardBackgroundColor = theme === 'light' ? '#F0F0F0' : '#424242';
  const buttonBackgroundColor = theme === 'light' ? '#94B9C5' : '#94B9C5';
  const buttonTextColor = theme === 'light' ? 'text-white' : 'text-black';

  const [newCardModalVisible, setNewCardModalVisible] = useState<boolean>(false);
  const [showCreateCardInput, setShowCreateCardInput] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCreditCardResult, setShowCreateCardResult] = useState<boolean>(false);

  const AccountDetail = ({ title, content }: { title: string, content: string }) => (
    <View style={tw`pb-4 pl-4`}>
      <Text style={[tw`text-sm`, { color: textColor }]}>{title}</Text>
      <Text style={[tw`font-bold text-2xl tracking-wide`, { color: textColor }]}>{content}</Text>
    </View>
  );
  return (
    <View style={[tw`flex-col h-full justify-between`, { backgroundColor }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
      <View style={tw`flex-row justify-between items-center mt-4 mx-4 py-2`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
            <Icon name="arrow-left" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
          </TouchableOpacity>
          <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>My Cards</Text>
        </View>
        <TouchableOpacity onPress={() => setNewCardModalVisible(true)} style={tw`mr-2`}>
          <Icon name="plus" size={28} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>
      <View style={tw``}>
        <ScrollView style={tw`w-full h-12/15 p-2 mb-4`} contentContainerStyle={tw`w-full flex-col items-center`}>
          <TouchableOpacity onPress={() => { }}>
            <CreditCard />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <CreditCard />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <CreditCard />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <CreditCard />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <CreditCard />
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={newCardModalVisible}
        onRequestClose={() => {
          setNewCardModalVisible(!newCardModalVisible);
        }}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-90 h-full`}>
          <View style={[tw`w-11/12 p-5 rounded-xl h-3/6 flex-col items-center justify-between`, { backgroundColor: cardBackgroundColor }]}>
            {!showCreditCardResult && <View style={tw`flex-row justify-between items-center w-full mb-4`}>
              <Text style={[tw`text-2xl font-bold`, { color: textColor }]}>
                Issue New Card
              </Text>
              <TouchableOpacity
                style={tw`p-2`}
                onPress={() => setNewCardModalVisible(false)}
              >
                <Icon name="x" size={28} color={textColor} />
              </TouchableOpacity>
            </View>}
            {/* Content */}
            {showCreateCardInput &&
              <View style={tw`w-full h-grow flex-col justify-between`}>
                <View>
                  <View style={tw`w-full`}>
                    <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Card Name</Text>
                    <View style={tw`flex-row w-full justify-between`}>
                      <TextInput
                        style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                        onChangeText={(text: any) => {
                          console.log(text);
                        }}
                        placeholder="e.g. Online Shopping / Groceries / etc..."
                        maxLength={16}
                        placeholderTextColor={textColor}
                      />
                    </View>
                  </View>
                  <View style={tw`mt-2`}>
                    <Text style={[tw`text-sm pl-2 pb-1`, { color: textColor }]}>Initial Balance</Text>
                    <View style={tw`flex-row w-full justify-between`}>
                      <TextInput
                        style={[tw`flex-row w-grow mr-1 border-2 bg-transparent`, { borderColor: textColor, color: textColor }]}
                        onChangeText={(text: any) => {
                          console.log(text);
                        }}
                        placeholder="SYP X,XXX"
                        maxLength={16}
                        keyboardType='numeric'
                        placeholderTextColor={textColor}
                      />
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[tw`flex-row justify-center items-center border-2 w-full mt-4`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                  onPress={() => {
                    setShowCreateCardInput(false);
                    setLoading(true);
                  }}
                >
                  <Icon name={"edit-2"} size={20} color={textColor} />
                  <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                    Issue Card
                  </Text>
                </TouchableOpacity>
              </View>
            }
            {loading &&
              <View style={tw`w-full h-grow flex-col justify-center`}>
                <TouchableOpacity onPress={() => {
                  setLoading(false);
                  setShowCreateCardResult(true);
                }}>
                  <ActivityIndicator size="large" color={textColor} />
                </TouchableOpacity>
              </View>
            }

            {showCreditCardResult &&
              <View style={tw`w-full h-grow flex-col justify-between`}>
                <View>
                  <View style={tw`w-full`}>
                    <View style={tw`w-full flex-row justify-start items-center mb-2`}>
                      <Icon name="check-circle" size={28} color={textColor} />
                      <Text style={[tw`text-2xl font-bold ml-2`, { color: textColor }]}>Card Created Successfully</Text>
                    </View>
                    <View style={tw`w-full flex-row justify-center pb-4`}>
                      <View style={[tw`w-full border h-0`, { borderColor: textColor }]} />
                    </View>
                    <AccountDetail title='Card Number' content='0000 0000 0000 0000' />
                    <AccountDetail title='Card Name' content='Online Shopping' />
                    <AccountDetail title='Card Balance' content='SYP 10,000' />
                  </View>
                </View>
                <TouchableOpacity
                  style={[tw`flex-row justify-center items-center border-2 w-full`, { borderColor: textColor, padding: 16, borderRadius: 8 }]}
                  onPress={() => {
                    setShowCreateCardInput(false);
                    setLoading(false);
                    setShowCreateCardResult(false);
                    setNewCardModalVisible(false);
                  }}
                >
                  <Text style={[tw`text-base font-bold ml-2`, { color: textColor }]}>
                    Finish
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
      </Modal>
      <BottomTab navigation={navigation} />
    </View>


  );
};

export default MyCards;
