import React, { useState, useEffect, useRef } from "react";
import { AsyncStorage, ActivityIndicator, KeyboardAvoidingView, Alert, SafeAreaView, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import Logo from '../../components/Logo';
import {API} from '../../network';
import useProfile from '../../hooks/useProfile';
import updateProfile from '../../hooks/updateProfile';

import { useColorScheme  } from 'react-native';
import { Input, SocialIcon, Avatar } from 'react-native-elements';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export default function SetDPScreen({navigation, route}) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dpUri, setDPUri] = useState<string>(null);
  const [selectedImg, setSelectedImg] = useState<Object>(null);
  const [type, setType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
  }, []);

  async function handleSkip() {
    navigation.replace("Login");
  }

  async function handlePhotos() {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);
    if(!pickerResult.cancelled) {
      setSelectedImg(pickerResult);
      setDPUri(pickerResult.uri);
    }
  }

  async function handleSave(){
    if (selectedImg === null)
      handlePhotos();
    else{
      setIsLoading(true);
      let file = selectedImg;
      let res = await API.updloadDp(file);
      console.log("res", res);

      if (res !== ""){
        let profile = await useProfile();
        profile.photoURL = res;
        await updateProfile(profile);
      }
      setIsLoading(false);
      Alert.alert("Cool", "You are doing well!");
      navigation.replace("Login");
    }
  }

  async function handleCamera() {
    const { status } = await Camera.requestPermissionsAsync();
    console.log(status);

    if(status === 'granted'){
      const picture = await Camera.takePictureAsync({
        quality: 0,
        base64: true,
      });
      console.log(picture);
      // const isAvailable = await Camera.isAvailableAsync();
      // console.log(isAvailable);
      // if (isAvailable) {
      //   const cameraReady = await Camera.onCameraReady();
      //   if (cameraReady) {
      //     const picture = await Camera.takePictureAsync({
      //       quality: 0,
      //       base64: true,
      //     });
      //     console.log(picture);
      //
      //   }
      //   else {
      //     Alert.alert("Camera", "Camera not ready for action");
      //   }
      // }
      // else {
      //   Alert.alert("Camera", "Camera not available");
      // }
    }
    else{
      Alert.alert("Camera", "Permissions denied to access camera");
    }
  }

  return(
    <View style={[styles.container, {backgroundColor: Colors.colorWhite}]}>
      <KeyboardAvoidingView behavior="padding" style={[{padding: GlobalStyles.paddingArround}]}>
        <Logo
          source={require('../../assets/images/logo-x.png')}
          style={{marginBottom: 50, alignSelf: 'center'}}
        />
        <TitleLabel style={{marginBottom: 30}} title='Upload a selfie' size={20} weight='500' barHeight={5} barWidth={50} />
        <Avatar
          rounded
          title="Open Photos"
          source={{
            uri: dpUri,
          }}
          onPress={handlePhotos}
          size="xlarge"
          titleStyle={{color: Colors.colorGrey, fontSize: 30}}
          containerStyle={{borderWidth: 1, borderColor: Colors.colorGrey, alignSelf: 'center', marginTop: 20, marginBottom: 20}}
        />
        <TouchableOpacity
          style={{marginBottom: 30, alignSelf: 'center',}}
          onPress={handlePhotos}
        >
          <Text style={{color: Colors.colorDark}}>Open Photos</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <NButton
            disabled={isLoading}
            style={[styles.buttonStyle, {flex: 1, elevation: 0, justifyContent: 'center', backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primaryColor, marginRight: 10}]}
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
