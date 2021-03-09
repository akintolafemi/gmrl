import React, { useState, useEffect, useRef } from "react";
import { Keyboard, AsyncStorage, ActivityIndicator, KeyboardAvoidingView, Alert, SafeAreaView, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import Logo from '../../components/Logo';
import {API} from '../../network';
import Variables from '../../constants/Variables';

import { useColorScheme  } from 'react-native';
import { Input, SocialIcon } from 'react-native-elements';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon } from 'native-base';

import { CreditCardInput, LiteCreditCardInput } from "react-native-input-credit-card";

export default function SetupBillingCardScreen({navigation, route}) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardValues, setCardValues] = useState<Object>(null);
  const [email] = useState<string>('michealakintola106.pog@gmail.com');

  useEffect(() => {
  }, []);

  async function handleSave () {
    if (cardValues !== null) {
      setIsLoading(true);
      let initPayment = await API.initPaystackSubscription({email: email, amount: 10000, plan: Variables.paystackPlan});
      console.log(initPayment);
      if (initPayment.status) {
        let accessCode = initPayment.data.access_code;
        let cardNumber = cardValues.number;
        cardNumber = cardNumber.replace(/\s/g, '');
        let expiry = cardValues.expiry;
        expiry = expiry.split("/");
        let expiryMonth = expiry[0];
        let expiryYear = expiry[1];
        let cvc = cardValues.cvc;
        console.log({
          cardNumber: cardNumber,
          expiryMonth: expiryMonth,
          expiryYear: expiryYear,
          cvc: cvc,
          accessCode: accessCode
        });

        let chargeCard = await API.chargeCardPaystack({
          cardNumber: cardNumber,
          expiryMonth: expiryMonth,
          expiryYear: expiryYear,
          cvc: cvc,
          accessCode: accessCode
        });
        console.log(chargeCard);

        if (chargeCard.reference){
          let ver = await API.verifyPaystackCharge(chargeCard.reference);
          console.log(ver);

          if (ver.data.status === "success") {
            await API.savePaystackChargeRef({ref: chargeCard.reference, email: email});
            setIsLoading(false);
            navigation.navigate('SetDP');
          }
          else {
            Alert.alert("Error", "We tried to verify a test transaction on your card but was not successful. You can skip this step and try later");
          }
        }
        else {
          Alert.alert("Error", "We were unable to test charge your card at the moment, but we will keep trying...");
          setIsLoading(false);
        }
      }
      else {
        Alert.alert("Error", "Unable to validate your card");
        setIsLoading(false);
      }
    }
    else {
      Alert.alert("Error", "Card details are invalid");
    }
  }

  async function handleSkip () {
    navigation.navigate('SetDP');
  }

  const handleValuesChange = (v) => {
    console.log(v);
    if (v.valid){
      setCardValues(v.values);
      Keyboard.dismiss();
    }
    else
      setCardValues(null);
  }

  return(
    <View style={[styles.container, {backgroundColor: Colors.colorWhite}]}>
      <KeyboardAvoidingView behavior="padding" style={[{padding: GlobalStyles.paddingArround}]}>
        <Logo
          source={require('../../assets/images/logo-x.png')}
          style={{marginBottom: 50, alignSelf: 'center'}}
        />
        <TitleLabel style={{marginBottom: 30}} title='Help us set up your billing information' size={20} weight='500' barHeight={5} barWidth={50} />
        <CreditCardInput
          onChange={(values) => handleValuesChange(values)}
          requiresName={true}
          autoFocus={false}
          labels={{ name: "NAME ON CARD", number: "CARD NUMBER", expiry: "EXPIRY", cvc: "CVC/CCV" }}
          placeholders={{ name: "John Doe", number: "1234 5678 1234 5678", expiry: "MM/YY", cvc: "CVC" }}
          cardScale={0.8}
          labelStyle={{fontSize: 12, fontWeight: 'normal', color: Colors.primaryColor}}
          validColor={Colors.colorDark}
          invalidColor={Colors.colorDanger}
          allowScroll={true}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <NButton
            disabled={isLoading}
            style={[styles.buttonStyle, {flex: 1, justifyContent: 'center', elevation: 0, backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primaryColor, marginRight: 10}]}
            onPress={handleSkip}
          >
            <Text style={{color: Colors.primaryColor}}>Skip</Text>
          </NButton>
          <NButton
            disabled={isLoading}
            style={[styles.buttonStyle, {flex: 1, justifyContent: 'center', marginLeft: 10}]}
            onPress={handleSave}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.colorWhite} size='small'/>
            ) : (
              <Text style={{color: Colors.colorWhite}}>Save</Text>
            )
            }
          </NButton>
        </View>
      </KeyboardAvoidingView>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonStyle: GlobalStyles.buttonStyle,
});
