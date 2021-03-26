import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert, useWindowDimensions, Image, AsyncStorage } from 'react-native';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import {API} from '../../network';
import FX from '../../functions';

import Logo from '../../components/Logo';
import CountrySelect from '../../functions/CountrySelect';
import CountryCodeSelect from '../../functions/CountryCodeSelect';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input as RNEInput, Button as RNEButton, SocialIcon } from 'react-native-elements';
import { Button as NButton, Item, Icon as NIcon, Input as NInput, Picker as Picker } from 'native-base';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';

export default function SignUpScreen({navigation, route}) {

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [country, setCountry] = useState<number>(168);    //default country Nigeria
  const [city, setCity] = useState<string>('Lagos');
  const [countryList] = useState(CountrySelect.country_arr);
  const [cityList, setCityList] = useState<Array>(CountrySelect.fetchCities(169)); //default Nigerian states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { width: windowWidth } = useWindowDimensions();
  const attemptInvisibleVerification = false;
  const captchaRef = useRef(null);
  useEffect(() => {


  }, []);

  async function handleContinue() {
    let validateEmail = await FX.validateEmail(email);
    //let validatePassword = await FX.validatePassword(password);
    if (username === "")
      Alert.alert("Error", "Create a username");
    else if (email === "")
      Alert.alert("Error", "Enter your email address");
    else if (!validateEmail)
      Alert.alert("Error", "Invalid email address");
    else if (country === "" || country === 0)
      Alert.alert("Error", "Select your country to continue");
    else if (city === "")
      Alert.alert("Error", "Select your state or city to continue");
    else {
      let codes = CountryCodeSelect.getCodes(countryList[country]);
      let mobileX = mobile;
      if (mobileX.charAt(0) === '0') {
        mobileX = mobileX.substr(1, mobileX.length - 1);
        let dial_code = codes.dial_code;
        mobileX = dial_code.concat(mobileX);
      }
      else if (mobileX.charAt(0) !== '+' && mobileX.charAt(0) !== '0') {
        mobileX = '+'.concat(mobileX);
      }
      let regObj = {
        email: email,
        username: username,
        fullname: fullname,
        mobile: mobileX,
        country: countryList[country],
        city: city
      };
      setIsLoading(true);
      await AsyncStorage.setItem('regObj', JSON.stringify(regObj))
      let numLock = mobile.substr(mobileX.length - 5, mobileX.length - 1);
      console.log(mobileX);

      let confirm = await API.sendTokenMobile(mobileX, captchaRef.current);
      console.log(confirm);

      setIsLoading(false);
      if (confirm.code === "00")
        navigation.navigate('VerifyMobile', {mobile: mobile, numLock: numLock, verificationId: confirm.verificationId});
      else
        Alert.alert("Error", confirm.message);
    }
//    navigation.navigate('VerifyMail');
  }

  function handleCountrySelect(selectedIndex: number) {
    setCity('');
    setCountry(selectedIndex);
    setCityList(CountrySelect.fetchCities(selectedIndex + 1));
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={[{padding: GlobalStyles.paddingArround}]}>
        <Logo
          source={require('../../assets/images/logo-x.png')}
          style={{marginBottom: 50, alignSelf: 'center'}}
        />
        <Item>
          <NIcon name='user-secret' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Choose a username"
             value={username}
             onChangeText={text => setUsername(text)}
             style={styles.inputStyle}
             returnKeyType="next"
             keyboardType='default'
          />
        </Item>
        <Item>
          <NIcon name='envelope' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Your email address"
             value={email}
             onChangeText={text => setEmail(text)}
             style={styles.inputStyle}
             returnKeyType="next"
             keyboardType='email-address'
          />
        </Item>
        <Item>
          <NIcon name='phone' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Mobile Number (e.g +1603678765)"
             value={mobile}
             onChangeText={text => setMobile(text)}
             style={styles.inputStyle}
             returnKeyType="next"
             keyboardType="phone-pad"
          />
        </Item>
        <Item>
          <NIcon name='user' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Tell us your full name"
             value={fullname}
             onChangeText={text => setFullname(text)}
             style={styles.inputStyle}
             returnKeyType="next"
             keyboardType='default'
          />
        </Item>
        <Item>
          <NIcon name='globe' type="FontAwesome" style={styles.iconStyle} />
          <Picker
            mode="dropdown"
            iosHeader="Country"
            //iosIcon={<NIcon name="caret-down" style={{fontSize: 14}} />}
            style={{ height: 40 }}
            textStyle={{fontSize: 12}}
            selectedValue={country}
            onValueChange={handleCountrySelect}
          >
            {countryList.map((item, index) => {
              return (< Picker.Item label={item} value={index} key={index.toString()} />);
            })}
          </Picker>
        </Item>
        <Item>
          <NIcon name='building' type="FontAwesome" style={styles.iconStyle} />
          <Picker
            mode="dropdown"
            iosHeader="State/City"
            //iosIcon={<NIcon name="caret-down" style={{fontSize: 14}} />}
            style={{ height: 40 }}
            textStyle={{fontSize: 12}}
            selectedValue={city}
            onValueChange={value => setCity(value)}
          >
            {cityList.map((item, index) => {
              return (< Picker.Item label={item} value={item} key={index.toString()} />);
            })}
          </Picker>
        </Item>
        <NButton
          block
          disabled={isLoading}
          style={[styles.buttonStyle, {marginTop: 10}]}
          onPress={handleContinue}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.colorWhite} size='small'/>
          ) : (
            <Text style={{color: Colors.colorWhite}}>Continue</Text>
          )
          }
        </NButton>
        <View
          style={{alignItems: 'center', marginTop: 20}}
        >
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text>Have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={{color: Colors.primaryColor}}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <FirebaseRecaptchaVerifierModal
        ref={captchaRef}
        firebaseConfig={API.firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    justifyContent: 'center'
  },
  splitView: {
    flex: 1,
  },
  buttonStyle: GlobalStyles.buttonStyle,
  iconStyle: GlobalStyles.iconStyle,
  inputStyle: GlobalStyles.inputStyle,
});
