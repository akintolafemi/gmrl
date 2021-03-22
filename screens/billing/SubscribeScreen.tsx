import React, { useState, useEffect, useRef } from "react";
import { Keyboard, AsyncStorage, ActivityIndicator, KeyboardAvoidingView, Alert, SafeAreaView, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import Logo from '../../components/Logo';
import {API} from '../../network';
import Variables from '../../constants/Variables';
import PaystackConfig from '../../constants/PaystackConfig';
import useProfile from '../../hooks/useProfile';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon } from 'react-native-elements';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon } from 'native-base';

import PaystackWebView from 'react-native-paystack-webview';

export default function SubscribeScreen({navigation, route}) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [cardValues, setCardValues] = useState<Object>(null);
  const [profile, setProfile] = useState<Object>({});
  const [email, setEmail] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [subscriptionHistory, setSubscriptionHistory] = useState<Array>([]);

  useEffect(() => {

    navigation.addListener('focus', () => {
      if (API.isUser()) {
        useProfile().then((data) => {
          if (data !== null) {
            console.log(data);

            setProfile(data);
            setEmail(data.email);
            setFullname(data.fullname);
            setPhoneNumber(data.phoneNumber);
            setSubscriptionHistory(data.subscriptionHistory);
          }
          else {
            navigation.replace('Login');
          }
        });
      }
      else
        navigation.replace("Login");
    });

  }, [navigation]);

  function cancelPayment(e) {
    console.log(e);

    Alert.alert("Error", "You have cancelled subscription channel, ensure you subscribe within the next 7 days to keep enjoying");
  }

  async function successPayment (e) {
    console.log(e);
    if (e.status === "success") {
      setIsLoading(true);
      let startDay = new Date();
      var endDay = new Date();
      endDay.setDate(endDay.getDate() + 31);
      // let subH = subscriptionHistory;
      // subH.push({start: startDay, end: endDay});
      // console.log(subH);

      let addS = await API.addSubscription({start: startDay, end: endDay});
      console.log(addS);
      if (addS) {
        let saveRef = await API.savePaystackChargeRef({ref: e.transactionRef.reference, email: email});
        console.log(saveRef);
        setIsLoading(false);
        navigation.navigate('SetDP');
      }
      else {
        Alert.alert("Error", "Unable to update your subscription");
      }
    }
    else {
      Alert.alert("Error", "We tried to charge your card but was not successful. You can skip this step and try later");
    }
    // if (e.reference){
    //   let ver = await API.verifyPaystackCharge(chargeCard.reference);
    //   console.log(ver);
    //
    //   if (ver.data.status === "success") {
    //     await API.savePaystackChargeRef({ref: chargeCard.reference, email: email});
    //     setIsLoading(false);
    //     navigation.navigate('SetDP');
    //   }
    //   else {
    //     Alert.alert("Error", "We tried to verify a test transaction on your card but was not successful. You can skip this step and try later");
    //   }
    // }
    // else {
    //   Alert.alert("Error", "We were unable to test charge your card at the moment, but we will keep trying...");
    //   setIsLoading(false);
    // }

    // if (cardValues !== null) {
    //   setIsLoading(true);
    //   let initPayment = await API.initPaystackSubscription({email: email, amount: 10000, plan: Variables.paystackPlan});
    //   console.log(initPayment);
    //   if (initPayment.status) {
    //     let accessCode = initPayment.data.access_code;
    //     let cardNumber = cardValues.number;
    //     cardNumber = cardNumber.replace(/\s/g, '');
    //     let expiry = cardValues.expiry;
    //     expiry = expiry.split("/");
    //     let expiryMonth = expiry[0];
    //     let expiryYear = expiry[1];
    //     let cvc = cardValues.cvc;
    //     console.log({
    //       cardNumber: cardNumber,
    //       expiryMonth: expiryMonth,
    //       expiryYear: expiryYear,
    //       cvc: cvc,
    //       accessCode: accessCode
    //     });
    //
    //     let chargeCard = await API.chargeCardPaystack({
    //       cardNumber: cardNumber,
    //       expiryMonth: expiryMonth,
    //       expiryYear: expiryYear,
    //       cvc: cvc,
    //       accessCode: accessCode
    //     });
    //     console.log(chargeCard);
    //
    //
    //   }
    //   else {
    //     Alert.alert("Error", "Unable to validate your card");
    //     setIsLoading(false);
    //   }
    // }
    // else {
    //   Alert.alert("Error", "Card details are invalid");
    // }
  }

  async function handleSkip () {
    setIsLoading2(true);
    let startDay = new Date();
    var endDay = new Date();
    endDay.setDate(endDay.getDate() + 7);
    // let subH = subscriptionHistory;
    // subH.push({start: startDay, end: endDay});
    let addS = await API.addSubscription({start: startDay, end: endDay});
    console.log(addS);
    if (addS) {
      setIsLoading2(false);
      navigation.navigate('SetDP');
    }
    else {
      Alert.alert("Error", "Unable to update your subscription");
    }
  }

  // const handleValuesChange = (v) => {
  //   console.log(v);
  //   if (v.valid){
  //     setCardValues(v.values);
  //     Keyboard.dismiss();
  //   }
  //   else
  //     setCardValues(null);
  // }

  const genTnxRef = (length) => {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
  }

  return(
    <View style={[styles.container, {backgroundColor: Colors.colorWhite}]}>
      <KeyboardAvoidingView behavior="padding" style={[{padding: GlobalStyles.paddingArround}]}>
        <Logo
          source={require('../../assets/images/logo-x.png')}
          style={{marginBottom: 50, alignSelf: 'center'}}
        />
        <TitleLabel style={{marginBottom: 30}} title='Subscribe to GMRL and become Premium user' size={20} weight='500' barHeight={5} barWidth={50} />
        {/*<CreditCardInput
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
        />*/}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <NButton
            disabled={isLoading}
            style={[styles.buttonStyle, {flex: 1, justifyContent: 'center', elevation: 0, backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primaryColor, marginRight: 10, marginTop: 10}]}
            onPress={handleSkip}
          >
            {isLoading2 ? (
              <ActivityIndicator color={Colors.colorWhite} size='small'/>
            ) : (
              <Text style={{color: Colors.primaryColor}}>Skip</Text>
            )
            }
          </NButton>
          <PaystackWebView
            showPayButton={true}
            paystackKey={PaystackConfig.publicKey}
            amount={Variables.subscriptionCharge}
            billingEmail={email}
            billingMobile={phoneNumber}
            billingName={fullname}
            ActivityIndicatorColor={Colors.primaryColor}
            SafeAreaViewContainer={{marginTop: 5}}
            SafeAreaViewContainerModal={{marginTop: 5}}
            onCancel={(e) => cancelPayment(e)}
            onSuccess={(e) => successPayment(e)}
            autoStart={false}
            channels={JSON.stringify(["card", "bank", "ussd", "qr", "mobile_money"])}
            refNumber={genTnxRef(30)}
            renderButton={(onPress) => (
              <NButton
                disabled={isLoading}
                style={[styles.buttonStyle, {width: '100%', justifyContent: 'center'}]}
                onPress={onPress}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.colorWhite} size='small'/>
                ) : (
                  <Text style={{color: Colors.colorWhite}}>Subscribe Now</Text>
                )
                }
              </NButton>
            )}
            btnStyles={{flex: 1, marginLeft: 10}}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonStyle: GlobalStyles.buttonStyle,
});
