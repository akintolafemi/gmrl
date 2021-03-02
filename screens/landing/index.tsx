import React, { useState, useEffect, useRef } from "react";
import { AsyncStorage, FlatList, Alert, ActivityIndicator, SafeAreaView, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import Logo from '../../components/Logo';
import ProfileView from '../../components/ProfileView';
import {API} from '../../network';
import ToDateTime from '../../functions/ToDateTime';
import useProfile from '../../hooks/useProfile';
import updateProfile from '../../hooks/updateProfile';

import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon, Header } from 'react-native-elements';
import moment from 'moment';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon } from 'native-base';
import { FlatGrid } from 'react-native-super-grid';
import { Modalize } from 'react-native-modalize';
import ImageView from "react-native-image-viewing";

import {WModal} from 'react-native-smart-tip';

import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-crop-fixed';
export default function LandingScreen({navigation, route}) {

  const modalizeRef = useRef<Modalize>(null);
  const [profile, setProfile] = useState<Object>({});
  const [dob, setDob] = useState<Object>({});
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [imageCropper, setImageCropper] = useState<boolean>(false);
  const [cropperUri, setCropperUri] = useState<string>('');

  useEffect(() => {

    navigation.addListener('focus', () => {
      if (API.isUser()) {
        useProfile().then((data) => {
          if (data !== null) {
            setProfile(data);
            setDob(ToDateTime(data.dob.seconds));
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

  const [items, setItems] = useState([
    { name: 'TURQUOISE', code: '#1abc9c' },
    { name: 'EMERALD', code: '#2ecc71' },
    { name: 'PETER RIVER', code: '#3498db' },
    { name: 'AMETHYST', code: '#9b59b6' },
    { name: 'WET ASPHALT', code: '#34495e' },
    { name: 'GREEN SEA', code: '#16a085' },
    { name: 'NEPHRITIS', code: '#27ae60' },
    { name: 'BELIZE HOLE', code: '#2980b9' },
    { name: 'WISTERIA', code: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
    { name: 'SUN FLOWER', code: '#f1c40f' },
    { name: 'CARROT', code: '#e67e22' },
    { name: 'ALIZARIN', code: '#e74c3c' },
    { name: 'CLOUDS', code: '#ecf0f1' },
    { name: 'CONCRETE', code: '#95a5a6' },
    { name: 'ORANGE', code: '#f39c12' },
    { name: 'PUMPKIN', code: '#d35400' },
    { name: 'POMEGRANATE', code: '#c0392b' },
    { name: 'SILVER', code: '#bdc3c7' },
    { name: 'ASBESTOS', code: '#7f8c8d' },
  ]);

  const dataArray = [
    {
      title: 'Likes',
      icon: 'heart-outline',
      count: profile.profileLikes
    },
    {
      title: 'Friends',
      icon: 'people-outline',
      count: profile.profileFriends
    },
    {
      title: 'Age',
      icon: 'aperture-outline',
      count: dob.age
    },
    {
      title: 'Gender',
      icon: 'transgender-outline',
      count: profile.gender
    },
  ]

  async function handleLogout() {
    WModal.show({
      data: 'Login out...',
      textColor: Colors.primaryColor,
      backgroundColor: Colors.colorWhite,
      position: WModal.position.CENTER,
      icon: <ActivityIndicator color={Colors.primaryColor} size={'medium'}/>
    })
    let res = await API.logout();
    WModal.hide();
    if (res === "signedout")
      navigation.navigate('Login');
    else
      Alert.alert("Error", res);
  }

  function handleUserClick() {
    modalizeRef.current?.open();
  }

  function handleDp() {
    setImageModal(true);
  }

  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <Logo
            source={require('../../assets/images/logo-x-white.png')}
            style={{}}
          />
        }
        rightComponent={
          <TouchableOpacity
            onPress={handleLogout}
          >
            <NIcon name='log-out' style={{fontSize: 25, color: Colors.colorWhite,}} />
          </TouchableOpacity>
        }
        containerStyle={{
          height: 100,
          paddingBottom: 20,
          paddingHorizontal: 20
        }}
        rightContainerStyle={{
          justifyContent: 'center'
        }}
        backgroundColor={Colors.primaryColor}
      />
      <ScrollView
        style={{flex: 1, paddingHorizontal: GlobalStyles.paddingArround}}
      >
        <ProfileView
          dataArray={dataArray}
          username={profile.displayName}
          city={profile.city}
          country={profile.country}
          avatarSize="large"
          avatarUri={profile.photoURL}
          avartarPress={handleDp}
          genderInterest={profile.genderInterest}
          about={profile.aboutMe !== "" ? profile.aboutMe : ""}
          containerStyle={{marginTop: 10, marginBottom: 40}}
        />

        <SafeAreaView>
          <FlatGrid
            itemDimension={100}
            data={items}
            style={styles.gridView}
            // staticDimension={300}
            // fixed
            spacing={5}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={handleUserClick}
                >
                  <Image
                    style={{height: '100%', width: '100%'}}
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </SafeAreaView>
      </ScrollView>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        onClosed={() => {
          console.log("modal closed");
        }}
        onBackButtonPress={() => {
        }}
        modalStyle={{borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingHorizontal: GlobalStyles.paddingH}}
        HeaderComponent={
          <View style={{backgroundColor: Colors.appColorThree, alignItems: 'center', paddingVertical: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
            <Text style={{color: Colors.colorDark, fontWeight: 'bold', fontSize: 15}}>Username</Text>
          </View>
        }
      >
        <ProfileView
          dataArray={dataArray}
          username='Femi'
          city='Abuja'
          country='Nigeria'
          avatarSize="large"
          avatarUri='https://randomuser.me/api/portraits/men/41.jpg'
          genderInterest="Women"
          about="Just in case this helps someone, this is how I fixed the error in my case. Just in case this helps someone, this is how I fixed the error in my case. Just in case this helps someone, this is how I fixed the error in my case."
          containerStyle={{marginTop: 10, marginBottom: 40}}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50}}>
          <NButton
            style={[styles.btnSmall, {backgroundColor: Colors.primaryColor, marginRight: 5}]}
          >
            <Text style={{color: Colors.colorWhite}}>Like</Text>
          </NButton>
          <NButton
            transparent
            style={[styles.btnSmall, {borderColor: Colors.primaryColor, borderWidth: 1, marginLeft: 5}]}
          >
            <Text style={{color: Colors.primaryColor}}>Add</Text>
          </NButton>
        </View>
      </Modalize>
      <ImageView
        images={[{ uri: profile.photoURL }]}
        imageIndex={0}
        visible={imageModal}
        onRequestClose={() => setImageModal(false)}
        HeaderComponent={ ({imageIndex}) => (
          <SafeAreaView
            style={{justifyContent: "flex-end", alignItems: 'center', flexDirection: 'row', marginHorizontal: 20}}
          >
            <TouchableOpacity>
              <NIcon name='pencil-outline' style={{fontSize: 20, color: Colors.colorWhite, marginRight: 10}} onPress={openImagePicker} />
            </TouchableOpacity>
            <TouchableOpacity>
              <NIcon name='close-outline' style={{fontSize: 22, color: Colors.colorWhite}} onPress={onRequestCloseModal} />
            </TouchableOpacity>
          </SafeAreaView>
        )}
        backgroundColor={Colors.colorDark}
      />
      <ImageManipulator
        photo={{ uri: cropperUri }}
        isVisible={imageCropper}
        onPictureChoosed={(uriM) => handleSelectedImg(uriM)}
        onToggleModal={() =>setImageCropper(false)}
        fixedMask={{
          'width': 250,
          'height': 250
        }}
        saveOptions={{
          "base64": true
        }}
      />
    </View>
  );

  async function handleSelectedImg(file){
    setImageCropper(false);

    let res = await API.updloadDp(file);
    if (res !== ""){
      let pp = profile;
      pp.photoURL = res;
      await updateProfile(pp);
      useProfile().then((data) => {
        console.log(data);

        setProfile(data);
      });
    }
  }

  function onRequestCloseModal() {
    setImageModal(false);
  }

  async function openImagePicker() {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    handleSelectedImg(pickerResult);
    // await setCropperUri(pickerResult.uri);
    // setImageModal(false);
    // setImageCropper(true);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    padding: 5,
    height: 100,
  },
  btnSmall: {
    height: 30,
    flex: 1,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
