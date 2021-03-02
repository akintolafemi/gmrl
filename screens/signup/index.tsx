import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert, useWindowDimensions, Image, AsyncStorage } from 'react-native';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import {API} from '../../network';
import FX from '../../functions';

import Logo from '../../components/Logo';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input as RNEInput, Button as RNEButton, SocialIcon } from 'react-native-elements';
import { Button as NButton, Item, Icon as NIcon, Input as NInput } from 'native-base';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';

export default function SignUpScreen({navigation, route}) {

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { width: windowWidth } = useWindowDimensions();
  const attemptInvisibleVerification = false;
  const captchaRef = useRef(null);
  useEffect(() => {


  }, []);

  async function handleContinue() {
    let validateEmail = await FX.validateEmail(email);
    let validatePassword = await FX.validatePassword(password);
    if (username === "")
      Alert.alert("Error", "Create a username");
    else if (email === "")
      Alert.alert("Error", "Enter your email address");
    else if (!validateEmail)
      Alert.alert("Error", "Invalid email address");
    else if (password === "")
      Alert.alert("Error", "You have to create sign in password");
    else if (!validatePassword)
      Alert.alert("Error", "Password strength too low");
    else if (confirmPassword !== password)
      Alert.alert("Error", "Confirm password is empty or does not match")
    else {
      let regObj = {
        email: email,
        username: username,
        password: password,
        fullname: fullname,
        mobile: mobile
      };
      setIsLoading(true);
      await AsyncStorage.setItem('regObj', JSON.stringify(regObj))
      let numLock = mobile.substr(mobile.length - 5, mobile.length - 1);
      console.log(mobile);

      let confirm = await API.sendTokenMobile(mobile, captchaRef.current);
      console.log(confirm);

      setIsLoading(false);
      if (confirm.code === "00")
        navigation.navigate('VerifyMobile', {mobile: mobile, numLock: numLock, confirm: confirm.verificationId});
      else
        Alert.alert("Error", confirm.message);
    }
//    navigation.navigate('VerifyMail');
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
          <NIcon name='lock' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Create your password"
             value={password}
             onChangeText={text => setPassword(text)}
             style={styles.inputStyle}
             secureTextEntry={true}
             returnKeyType="next"
             keyboardType='default'
          />
        </Item>
        <Item>
          <NIcon name='thumb-tack' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Help us confirm your password"
             value={confirmPassword}
             onChangeText={text => setConfirmPassword(text)}
             style={styles.inputStyle}
             secureTextEntry={true}
             returnKeyType="done"
             keyboardType='default'
          />
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
