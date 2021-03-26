import React, { useState, useEffect, useRef, useCallback } from "react";
import { AsyncStorage, FlatList, ActivityIndicator, KeyboardAvoidingView, Alert, SafeAreaView, Keyboard, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';
import * as firebase from 'firebase';
import "firebase/auth";
import {API} from '../../network';
import useProfile from '../../hooks/useProfile';
import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon, Header, ListItem, Avatar } from 'react-native-elements';
import moment from 'moment';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon, Fab } from 'native-base';
import Colors from '../../constants/Colors';
import ConnectyCubeConfig from '../../constants/ConnectyCubeConfig';
import GlobalStyles from '../../constants/GlobalStyles';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { WebView } from 'react-native-webview';

export default function CallScreen({navigation, route}) {

  const selectedConnection = route.params.selected;
  const currentUserUID = firebase.auth().currentUser.uid;
  const [photoURL, setPhotoURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {

    //let isMounted = true;

    navigation.addListener('focus', () => {
      useProfile().then((data) => {
        if (data !== null) {
          setPhotoURL(data.photoURL);
        }
        else {
          navigation.replace('Login');
        }
      });
    });

  }, [navigation]);

  function loadingView() {
    setIsLoading(true)
  }

  function loadedView() {
    setIsLoading(false)
  }

  function messageReceived(e) {
    console.log(e);
  }

  const renderVideoView = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <!-- Font Awesome -->
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        rel="stylesheet"
      />
      <!-- Google Fonts -->
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
      />
      <!-- MDB -->
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.3.0/mdb.min.css"
        rel="stylesheet"
      />
      <title>${selectedConnection.displayName}</title>
    </head>
    <body  onload="" style="background-color:#fff;height:100vh ">
      <!-- MDB -->
      <script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.3.0/mdb.min.js"
      ></script>
      <script src="https://cdn.jsdelivr.net/npm/connectycube@3.7.8/dist/connectycube.min.js"></script>
      <script>
        
        const CREDENTIALS = {
          appId: 4235,
          authKey: "UHpOXeqmR32uW2H",
          authSecret: "mvANReYmGDfFmGp",
        };
        ConnectyCube.init(CREDENTIALS);

      </script>
    </body>
  </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={[{ flex: 1 }]}
        source={{ html: renderVideoView }}
        onMessage={(e) => {
          messageReceived(e);
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View>
          <ActivityIndicator
            size="large"
            color={Colors.primaryColor}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite
  },
});
