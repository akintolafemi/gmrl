import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert, useWindowDimensions, Image } from 'react-native';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import {API} from '../../network';
import useProfile from '../../hooks/useProfile';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input as RNEInput, Button as RNEButton, SocialIcon } from 'react-native-elements';
import { Button as NButton, Item, Icon as NIcon, Input as NInput } from 'native-base';
import Swiper from 'react-native-web-swiper';

export default function LoginScreen({navigation, route}) {

  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { width: windowWidth } = useWindowDimensions();
  const [profile, setProfile] = useState<Object>(null);

  useEffect(() => {

    navigation.addListener('focus', () => {
    //  if (API.isUser()) {
        useProfile().then((data) => {
          if (data !== null) {
            setProfile(data)
            setEmail(data.email)
            setDisplayName(data.displayName)
          }
        });
    //  }
    });

  }, [navigation]);

  const sliderImages = [
    { url: "https://ugc.reveliststatic.com/gen/constrain/640/640/80/2018/03/23/17/6w/gv/phorcb05oo2qbwe.jpg" },
    { url: "https://www.megamodelagency.com/img/fotos/xlarge/2995xl1.jpg" },
    { url: "https://asset1.modelmanagement.com/mm-eyJ0Ijp7InIiOnsibCI6/IjE2MDAiLCJoIjoiMTIw/MCJ9LCJ3Ijp7InR4Ijoi/RWJvbnkgTHVuc2ZvcmRc/bm1vZGVsbWFuYWdlbWVu/dC5jb21cL21vZGVsXC9l/Ym9ueS1sdW5zZm9yZC0x/IiwidHhvIjp7ImwiOiI4/MDEiLCJoIjoiMTIwMCJ9/fSwiMCI6eyJ3Ijoic2Zt/In19LCJpZCI6Imk2MDcy/NjQ4IiwiZiI6ImpwZyJ9.jpg" },
    { url: "https://media.istockphoto.com/photos/beautiful-black-female-model-with-bald-hairstyle-picture-id1149375999?k=6&m=1149375999&s=612x612&w=0&h=PNli6MaFaQdWIRAl3iE47YsGGKaRazYX_Q_vJdK5ns8="},
    { url: "https://idealswift.com/img/fair-skin-girl.jpg" },
    { url: "https://idealswift.com/img/dark-skin-girl.jpg" },
    { url: "https://i.pinimg.com/564x/73/3e/2c/733e2cc3a5123beceb3e6b703a022800.jpg" },
  ];

  function clearData() {
    setProfile(null);
  }

  async function handleLogin() {
    if (email === "")
      Alert.alert("Error", "Enter email to login");
    else if (password === "")
      Alert.alert("Error", "Enter your password");
    else {
      setIsLoading(true);
      const res = await API.login({email: email, password: password});
      if (res.user) {
        const profile = await API.getUserProfile();
        if (profile !== null) {
          setEmail('');
          setPassword('');
          await AsyncStorage.setItem('gmrl', JSON.stringify(profile));
          navigation.navigate('Root');
        }
        else {
          console.log("profile is null");
          Alert.alert('We could not load your profile at the moment');
        }
      }
      else {
        Alert.alert("Login", res.toString());
      }
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.splitView}>
        <Swiper
          timeout={5}
          loop={true}
          controlsProps={{
            prevTitle: '',
            nextTitle: '',
            dotActiveStyle: {
              backgroundColor: Colors.primaryColor
            }
          }}
        >
          {sliderImages.map((item, index) => {
            return (
              <View
                style={{ width: windowWidth, height: '100%' }}
                key={index}
              >
                <Image source={{uri: item.url}} style={{height: '100%'}} />
              </View>
            );
          })}
        </Swiper>
      </View>
      <KeyboardAvoidingView behavior="padding" style={[styles.splitView, {padding: GlobalStyles.paddingArround}]}>
        {profile === null ? (
          <Item>
            <NIcon name='envelope' type="FontAwesome" style={styles.iconStyle} />
            <NInput
               placeholder="E-mail"
               value={email}
               onChangeText={text => setEmail(text)}
               style={styles.inputStyle}
               returnKeyType="next"
               keyboardType='email-address'
            />
          </Item>
        ) :
        <View style={{ marginTop: 5, marginBottom: 20}}>
          <Text>{displayName}, enter your password to continue</Text>
          <TouchableOpacity
            onPress={clearData}
          >
            <Text style={{color: Colors.primaryColor}}>Not you?</Text>
          </TouchableOpacity>
        </View>
        }
        <Item>
          <NIcon name='lock' type="FontAwesome" style={styles.iconStyle} />
          <NInput
             placeholder="Password"
             value={password}
             onChangeText={text => setPassword(text)}
             style={styles.inputStyle}
             secureTextEntry={true}
             returnKeyType="done"
             keyboardType='default'
          />
        </Item>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={{color: Colors.primaryColor, fontSize: 10, alignSelf: 'flex-end'}}>Forgot password?</Text>
        </TouchableOpacity>
        <NButton
          block
          disabled={isLoading}
          style={[styles.buttonStyle, {marginTop: 10}]}
          onPress={handleLogin}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.colorWhite} size='small'/>
          ) : (
            <Text style={{color: Colors.colorWhite}}>Sign In</Text>
          )
          }
        </NButton>
        <View
          style={{alignItems: 'center', marginTop: 20}}
        >
          <Text>Or sign in with</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity>
              <SocialIcon
                type='facebook'
                light
                raised={true}
                style={{borderRadius: 0}}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <SocialIcon
                type='google'
                light
                raised={true}
                style={{borderRadius: 0}}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={{color: Colors.primaryColor}}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
  },
  splitView: {
    flex: 1,
  },
  buttonStyle: GlobalStyles.buttonStyle,
  iconStyle: GlobalStyles.iconStyle,
  inputStyle: GlobalStyles.inputStyle,
});
