import React, { useState, useEffect, useRef } from "react";
import { AsyncStorage, FlatList, Alert, SafeAreaView, Keyboard, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';
import * as firebase from 'firebase';
import "firebase/auth";

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import ProfileView from '../../components/ProfileView';
import {API} from '../../network';
import ToDateTime from '../../functions/ToDateTime';

import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon, Header, ListItem, Avatar } from 'react-native-elements';
import moment from 'moment';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon, Fab } from 'native-base';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { ChatScreen as ChatUI } from 'react-native-easy-chat-ui';
import ImageView from "react-native-image-viewing";


export default function ChatScreen({navigation, route}) {

  const [inputContainerMargin, setInputContainerMargin] = useState<number>(10);
  const [imageModal, setImageModal] = useState<boolean>(false);
  const selectedConnection = route.params.selected;
  const [messages, setMessages] = useState<Array>([]);
  const [ch, setCh] = useState<number>(-1);

  useEffect(() => {

    let isMounted = true;

    navigation.addListener('focus', () => {

    });

    // API.getChats(selectedConnection.email).then((mes) => {
    //   if (mes !== null) {
    //     setMessages(mes);
    //   }
    // });

    let currentUserUID = firebase.auth().currentUser.uid;

    // firebase
    //   .firestore()
    //   .collection('message_threads')
    //   .where('_id', '==', currentUserUID)
    //   .where('owner', '==', selectedConnection.email)
    //   .onSnapshot(querySnapshot => {
    //     querySnapshot.docChanges().forEach(change => {
    //       updateMessageList(change.type, change.doc.data(), messages)
    //       // if (change.type === 'added') {
    //       //   setMessages(...messages, change.doc.data());
    //       // }
    //       // else if (change.type === 'modified') {
    //       //   updateMessageList(change.doc.data(), messages)
    //       // }
    //       // else if (change.type === 'removed') {
    //       //
    //       // }
    //     });
    //   }, (error) => {
    //     console.log(error);
    //   });
    // API.getChatsUpdated(selectedConnection.email).then((mes) => {
    //   console.log("mes-----------------------------------------------", mes);
    //
    //   if (mes.type === 0) {
    //     setMessages(messages => [...messages, mes.newChat]);
    //   }
    //   else if (mes.type === 1) {
    //     updateMessageList("mes.newChat", mes.newChat)
    //   }
    //   else if (mes.type === -1) {
    //
    //   }
    // });

    Keyboard.addListener('keyboardDidShow', (e) => {
      console.log(e);
      Platform.OS === 'ios' ? setInputContainerMargin(65) : setInputContainerMargin(inputContainerMargin);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      setInputContainerMargin(10);
    });

    return () => { isMounted = false };

  }, [navigation, Keyboard]);

  function handleSend(type, content, isInverted) {
    console.log(type, content, isInverted, 'msg')
  }

  function updateMessageList(type, obj, mesArray) {
    if (type === "added") {
      //mesList.push(obj);
      setMessages(messages => [...messages, obj])

      // let tempMessages;
      // tempMessages = mesArray.slice();
      // console.log("......................", tempMessages);
      //
      // tempMessages.push(obj);
      // console.log("////////////////////", tempMessages);
      // setMessages(tempMessages);

//      setMessages(tempMessages);
    }
    else if (type === "modified") {
      let tempMessages;
      if (messages.length > 20){
        tempMessages = messages.slice(20);
      }
      else{
        tempMessages = messages.slice();
      }
      console.log(obj);

//      setMessages(tempMessages);
      // console.log("messages", messages);
      // console.log("tempMessages", tempMessages);
      //
      // if (tempMessages.length > 0) {
      //   for (let i = 0; i < tempMessages.length; i++) {
      //     if (tempMessages[i].time === obj.time) {
      //       console.log("obj", obj);
      //
      //       let chat = tempMessages[i];
      //       chat.content = obj.content;
      //       console.log("new chat", chat);
      //       messages[i] = chat;
      //       setMessages(messages);
      //     }
      //   }
      // }
    }
    else if (type === "removed") {

    }
  }

  function handleShowDp() {
    setImageModal(true);
  }

  return (
    <View style={styles.container}>
      <Header
        placement="left"
        leftComponent={
          <TouchableOpacity>
            <Avatar
              rounded
              source={{
                uri: selectedConnection.photoURL,
              }}
              size="small"
              onPress={handleShowDp}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={{fontWeight: 'bold', fontSize: 15, color: Colors.colorWhite}}>{selectedConnection.displayName}</Text>
        }
        rightComponent={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity>
              <NIcon name='person' style={{fontSize: 18, color: Colors.colorWhite, marginLeft: 15}} />
            </TouchableOpacity>
            <TouchableOpacity>
              <NIcon name='ban' type="FontAwesome" style={{fontSize: 18, color: Colors.colorWhite, marginLeft: 15}} />
            </TouchableOpacity>
          </View>
        }
        containerStyle={{
          height: 100,
        }}
        centerContainerStyle={{justifyContent: 'center'}}
        rightContainerStyle={{justifyContent: 'center'}}
        containerStyle={{paddingHorizontal: GlobalStyles.paddingH}}
        backgroundColor={Colors.primaryColor}
      />
      <ImageView
        images={[{ uri: selectedConnection.photoURL }]}
        imageIndex={0}
        visible={imageModal}
        onRequestClose={() => setImageModal(false)}
      />
      <ChatUI
        messageList={messages}
        sendMessage={handleSend}
        isIPhoneX={true}
        iphoneXBottomPadding={70}
        renderAvatar={() => {

        }}
        placeholder="Type here..."
        useVoice={false}
        usePlus={false}
        useEmoji={false}
        leftMessageBackground={Colors.primaryColor}
        rightMessageBackground={Colors.colorWhite}
        leftMessageTextStyle={{color: Colors.colorWhite}}
        rightMessageTextStyle={{color: Colors.colorDark}}
        inputContainerStyle={{marginBottom: inputContainerMargin}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite
  },
});
