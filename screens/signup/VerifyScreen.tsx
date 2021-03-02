import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, Alert, ActivityIndicator, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';

import Colors from '../../constants/Colors';
import TitleLabel from '../../components/TitleLabel';
import Logo from '../../components/Logo';
import GlobalStyles from '../../constants/GlobalStyles';
import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Button as NButton, } from 'native-base';
import InputCode from 'react-native-input-code';
import {API} from '../../network';

export default function VerifyScreen({navigation, route}) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [mobile] = useState<string>(route.params.mobile);

  useEffect(() => {
  }, []);

  async function handleVerify() {
    if (token.length === 6) {
      //navigation.navigate('FinalSetup');
      setIsLoading(true);
      let response = await API.verifyTokenMobile({verificationId: route.params.verificationId, verificationCode: token});
      setIsLoading(false);
      if (response)
        navigation.navigate('FinalSetup');
      else
        Alert.alert("Error", "Unable to verify code");
    }
  }

  return(
    <View style={[styles.container, {backgroundColor: Colors.colorWhite}]}>
      <View style={[{padding: GlobalStyles.paddingArround}]}>
        <Logo
          source={require('../../assets/images/logo-x.png')}
          style={{marginBottom: 50, alignSelf: 'center'}}
        />
        <TitleLabel style={{marginBottom: 30}} title='We want to verify you' size={20} weight='500' barHeight={5} barWidth={50} />
        <Text style={{marginBottom: 10}}>We sent a verification code to the mobile ending with - {route.params.numLock}, please enter token below</Text>

        <View style={{marginVertical: 50}}>
          <InputCode
            length={6}
            codeContainerStyle={{
              borderWidth: 1,
              borderColor: Colors.colorGrey,
              width: 40,
              height: 40,
              padding: 5
            }}
            onChangeCode={text => setToken(text)}
          />
        </View>
        <NButton
          block
          disabled={isLoading}
          style={styles.buttonStyle}
          onPress={handleVerify}
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
              onPress={() => navigation.navigate('Login', {noSplash: false})}
            >
              <Text style={{color: Colors.primaryPurple}}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputStyles: GlobalStyles.inputStyles,
  buttonStyle: GlobalStyles.buttonStyle,
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
