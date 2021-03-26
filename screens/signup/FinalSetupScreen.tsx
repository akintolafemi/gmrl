import React, { useState, useEffect, useRef } from "react";
import { AsyncStorage, ActivityIndicator, KeyboardAvoidingView, Alert, SafeAreaView, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import Logo from '../../components/Logo';
import {API} from '../../network';
import FX from '../../functions';
//import CountrySelect from '../../functions/CountrySelect';

import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon } from 'react-native-elements';
import moment from 'moment';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon, Input as NInput } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function FinalSetupScreen({navigation, route}) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('M');
  const [genderInterest, setGenderInterest] = useState<string>('men');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // const [country, setCountry] = useState<number>(168);    //default country Nigeria
  // const [city, setCity] = useState<string>('Lagos');
  const [dob, setDob] = useState<string>(new Date());
  // const [countryList] = useState(CountrySelect.country_arr);
  // const [cityList, setCityList] = useState<Array>(CountrySelect.fetchCities(169)); //default Nigerian states

  useEffect(() => {
  }, []);

  const genderList = [
    {
      label: 'Male',
      value: 'M'
    },{
      label: 'Female',
      value: 'F'
    },{
      label: 'Other',
      value: 'O'
    },
  ];

  const interestList = [
    {
      label: 'Men',
      value: 'men'
    },{
      label: 'Women',
      value: 'women'
    },{
      label: 'Others',
      value: 'others'
    },
  ];

  async function handleSubmit () {
    let validatePassword = await FX.validatePassword(password);
    let year = moment(dob).format('YYYY');
    year = parseInt(year);

    let currentYr = new Date().getFullYear();
    currentYr = parseInt(currentYr);

    let diff = currentYr - year;

    if (password === "")
      Alert.alert("Error", "You have to create sign in password");
    else if (!validatePassword)
      Alert.alert("Error", "Password strength too low");
    else if (confirmPassword !== password)
      Alert.alert("Error", "Confirm password is empty or does not match");
    else if (dob === new Date() || dob === "-")
      Alert.alert("Error", "Invalid date of birth");
    else if (diff < 13)
      Alert.alert("Error", "You are too young to be on this app, come back in a few years time");
    // else if (country === "" || country === 0)
    //   Alert.alert("Error", "Select your country to continue");
    // else if (city === "")
    //   Alert.alert("Error", "Select your state or city to continue");
    else {
      let regObj = await AsyncStorage.getItem('regObj');

      regObj = JSON.parse(regObj);
      console.log(regObj);


      let photoURL = "https://firebasestorage.googleapis.com/v0/b/getmereallove.appspot.com/o/icon-x.png?alt=media&token=6f5164ad-552e-4316-8029-41a7f010d30e";
      if (gender === "F")
        photoURL = "https://firebasestorage.googleapis.com/v0/b/getmereallove.appspot.com/o/icon-y.png?alt=media&token=3854d4c0-515a-4817-aa6a-a6817b8e813e";

      regObj.password = password;
      regObj.dob = dob;
      regObj.gender = gender;
      regObj.genderInterest = genderInterest;
      //regObj.country = countryList[country];
      //regObj.city = city;
      regObj.photoURL = photoURL;
      console.log(regObj);


      setIsLoading(true);
      let response = await API.registerUser(regObj);
      if (response.user) {
        AsyncStorage.removeItem('regObj');
        AsyncStorage.removeItem('gmrl');
        let loginObj = {
          email: regObj.email,
          password: regObj.password
        };
        let logX = await handleLogin(loginObj);
        setIsLoading(false);
        if (logX)
          navigation.navigate('Subscribe', {email: regObj.email});
        else
          navigation.replace("Login");
      }
      else {
        Alert.alert("Error", response);
        setIsLoading(false);
      }

    }
  }

  async function handleLogin(loginObj) {
    const res = await API.login(loginObj);
    if (res.user) {
      const profile = await API.getUserProfile();
      await AsyncStorage.setItem('gmrl', JSON.stringify(profile));
      return true;
    }
    else {
      return false;
    }
  }

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function handleConfirmDate(date: string) {
    setDob(date);
    setShowDatePicker(false);
  }

  function handleCountrySelect(selectedIndex: number) {
    setCity('');
    setCountry(selectedIndex);
    setCityList(CountrySelect.fetchCities(selectedIndex + 1));
  }

  return(
    <View style={[styles.container, {backgroundColor: Colors.colorWhite}]}>
      <KeyboardAvoidingView behavior="padding" style={[{padding: GlobalStyles.paddingArround}]}>
        <Logo
          source={require('../../assets/images/logo-x.png')}
          style={{marginBottom: 50, alignSelf: 'center'}}
        />
        <TitleLabel style={{marginBottom: 30}} title='Final step' size={20} weight='500' barHeight={5} barWidth={50} />
        <View
          style={[styles.rowView, {marginBottom: 20}]}
        >
          <Text>Create your password:</Text>
          <NInput
             value={password}
             onChangeText={text => setPassword(text)}
             style={{fontSize: 12, height: 40, marginVertical: -10}}
             secureTextEntry={true}
             returnKeyType="next"
             keyboardType='default'
          />
        </View>
        <View
          style={[styles.rowView, {marginBottom: 20}]}
        >
          <Text>Confirm password:</Text>
          <NInput
             value={confirmPassword}
             onChangeText={text => setConfirmPassword(text)}
             style={{fontSize: 12, height: 40, marginVertical: -10}}
             secureTextEntry={true}
             returnKeyType="done"
             keyboardType='default'
          />
        </View>
        <View
          style={[styles.rowView, {marginBottom: 20}]}
        >
          <Text>Date of birth:</Text>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={() => setShowDatePicker(false)}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginHorizontal: 15}}>
            <Text style={{fontWeight: '500'}}>
              {dob ? moment(dob).format('MMMM DD, YYYY') : '-'}
            </Text>
            <NIcon name='calendar' type="FontAwesome" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <View
          style={styles.rowView}
        >
          <Text>Tell us your gender: </Text>
          <Picker
            mode="dropdown"
            iosHeader="Select your gender"
            iosIcon={<NIcon name="caret-down" style={{fontSize: 14}} />}
            style={{ height: 40 }}
            selectedValue={gender}
            onValueChange={value => setGender(value)}
          >
            {genderList.map((item, index) => {
              return (< Picker.Item label={item.label} value={item.value} key={item.value} />);
            })}
          </Picker>
        </View>
        <View
          style={styles.rowView}
        >
          <Text>Interested in: </Text>
          <Picker
            mode="dropdown"
            iosHeader="Interested in"
            iosIcon={<NIcon name="caret-down" style={{fontSize: 14}} />}
            style={{ height: 40 }}
            selectedValue={genderInterest}
            onValueChange={value => setGenderInterest(value)}
          >
            {interestList.map((item, index) => {
              return (< Picker.Item label={item.label} value={item.value} key={item.value} />);
            })}
          </Picker>
        </View>
        {/*<View
          style={styles.rowView}
        >
          <Text>Country: </Text>
          <Picker
            mode="dropdown"
            iosHeader="Country"
            iosIcon={<NIcon name="caret-down" style={{fontSize: 14}} />}
            style={{  }}
            selectedValue={country}
            onValueChange={handleCountrySelect}
          >
            {countryList.map((item, index) => {
              return (< Picker.Item label={item} value={index} key={index.toString()} />);
            })}
          </Picker>
        </View>
        <View
          style={styles.rowView}
        >
          <Text>State/City: </Text>
          <Picker
            mode="dropdown"
            iosHeader="State/City"
            iosIcon={<NIcon name="caret-down" style={{fontSize: 14}} />}
            style={{  }}
            selectedValue={city}
            onValueChange={value => setCity(value)}
          >
            {cityList.map((item, index) => {
              return (< Picker.Item label={item} value={item} key={index.toString()} />);
            })}
          </Picker>
        </View>*/}
        <NButton
          block
          disabled={isLoading}
          style={styles.buttonStyle}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.colorWhite} size='small'/>
          ) : (
            <Text style={{color: Colors.colorWhite}}>Submit</Text>
          )
          }
        </NButton>
      </KeyboardAvoidingView>
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
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: GlobalStyles.iconStyle,
});
