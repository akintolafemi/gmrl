import React, { useState, useEffect, useRef, useCallback } from "react";
import { AsyncStorage, FlatList, KeyboardAvoidingView, ActivityIndicator, Alert, SafeAreaView, Keyboard, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';
import * as firebase from 'firebase';
import "firebase/auth";
//import ConnectyCube from "react-native-connectycube";

import Colors from '../../constants/Colors';
//import ConnectyCubeConfig from '../../constants/ConnectyCubeConfig';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import ProfileView from '../../components/ProfileView';
import {API} from '../../network';
import ToDateTime from '../../functions/ToDateTime';
import GetThreadId from '../../functions/GetThreadId';
import useProfile from '../../hooks/useProfile';
import getChats from '../../hooks/getChats';

import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon, Header, ListItem, Avatar } from 'react-native-elements';
import moment from 'moment';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon, Fab } from 'native-base';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { ChatScreen as ChatUI } from 'react-native-easy-chat-ui';
import { GiftedChat } from 'react-native-gifted-chat';
import ImageView from "react-native-image-viewing";


export default function ChatScreen({navigation, route}) {

  //ConnectyCube.init(ConnectyCubeConfig);

  const [inputContainerMargin, setInputContainerMargin] = useState<number>(10);
  const [imageModal, setImageModal] = useState<boolean>(false);
  const selectedConnection = route.params.selected;
  const currentUserUID = firebase.auth().currentUser.uid;
  const [photoURL, setPhotoURL] = useState<string>('');
  const [deliveryStatus, setDeliveryStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<number>(1);
  const [chatAcceptor, setChatAcceptor] = useState<string>('');
  const [chatStatusText, setChatStatusText] = useState<string>('');
  // const [messages, setMessages] = useState<Array>([
  //   {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: selectedConnection._id,
  //         name: 'React Native',
  //         avatar: selectedConnection.photoURL,
  //       },
  //     },
  // ]);
  const [messages, setMessages] = useState<Array>([]);
  const [ch, setCh] = useState<number>(-1);

  useEffect(() => {

    switch (chatStatus) {
      case 0:
        setChatStatusText('Chat request pending');
        break;
      case -1:
        setChatStatusText('This person blocked you');
      default:
        setChatStatusText('');
        break;
    }
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

      let messageThreadId = GetThreadId(selectedConnection._id, currentUserUID);

      getChats(messageThreadId).then((data) => {
        console.log(data);

        setMessages(data);
      })

      // API.getChats(messageThreadId)
      //   .then((data) => {
      //     setMessages(data);
      //   });
    });

    // API.getChats(selectedConnection.email).then((mes) => {
    //   if (mes !== null) {
    //     setMessages(mes);
    //   }
    // });

    let messageThreadId = GetThreadId(selectedConnection._id, currentUserUID);

    firebase
      .firestore()
      .collection('message_threads')
    //  .doc(messageThreadId)
      .where('_id', '==', messageThreadId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'modified') {
            let arrObj = change.doc.data();
            console.log(arrObj);

            setChatStatus(arrObj.status);
            setChatAcceptor(arrObj.acceptor);
            let arr = arrObj.chats;
            AsyncStorage.setItem('gmrl_chats_' + messageThreadId, JSON.stringify(arr));
            let addedMessage = arr[arr.length - 1];
            if (addedMessage.user._id !== currentUserUID)
              setMessages(previousMessages => GiftedChat.prepend(previousMessages, addedMessage));
            else {

            }
          }
          if (change.type === 'removed') {
            console.log('Removed chat: ', change.doc.data());
          }
        });
      }, (error) => {
        console.log(error);
      });
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
    //
    // Keyboard.addListener('keyboardDidShow', (e) => {
    //   console.log(e);
    //   Platform.OS === 'ios' ? setInputContainerMargin(65) : setInputContainerMargin(inputContainerMargin);
    // });
    //
    // Keyboard.addListener('keyboardDidHide', () => {
    //   setInputContainerMargin(10);
    // });

    //return () => { isMounted = false };

  }, [navigation, chatStatus]);

  function handleSend(type, content, isInverted) {
    console.log(type, content, isInverted, 'msg')
  }

  function handleShowDp() {
    setImageModal(true);
  }

  const onSend = useCallback((mes = []) => {
    try {
      mes[0].createdAt = mes[0].createdAt.toString();
      //messages[0].pending = true;
      //console.log(mes);

      let messageThreadId = GetThreadId(selectedConnection._id, currentUserUID);

      setMessages(previousMessages => GiftedChat.prepend(previousMessages, mes));
      API.updateChats({messageThreadId: messageThreadId, messageObj: mes[0]}).
        then((send) => {
          console.log(send);
          if (send) {
            setDeliveryStatus(true);
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
    catch (error) {
      console.log(error);
    }
  }, [])

  function changeStatus(currentMessage) {
    console.log(currentMessage);

    if(deliveryStatus) {
      currentMessage.sent = true;
      setDeliveryStatus(false);
    }
  }

  async function initializeCall () {
    Alert.alert(
      'Call',
      'Are you sure to start call?',
      [
        {text: 'NO', onPress: () => console.log('NO Pressed'), style: 'cancel'},
        {text: 'YES', onPress: () => {
          let connectyCubeUser = AsyncStorage.getItem('gmrl_connectycube_user');
          navigation.navigate('Call', {selected: selectedConnection, connectyCubeUser: connectyCubeUser});
        }},
      ]
    );
  }

  async function handleAcceptChat() {
    let messageThreadId = GetThreadId(selectedConnection._id, currentUserUID);
    setIsLoading(true);
    let accepted = await API.acceptConnection(messageThreadId);
    console.log(accepted);
    if(accepted)
      setIsLoading(false);
    else
      Alert.alert("Error", "Error accepting chat request");
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
            <TouchableOpacity
              onPress={initializeCall}
            >
              <NIcon name='call' style={{fontSize: 18, color: Colors.colorWhite, marginLeft: 15}} />
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
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUserUID,
          avatar: photoURL,
        }}
        inverted={false}
        maxInputLength={200}
        renderAvatar={null}
        renderChatFooter={ () => (
          chatStatus == 0 && chatAcceptor == currentUserUID ?
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={handleAcceptChat}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.primaryColor} size='small'/>
              ) : (
                <Text style={{marginBottom: 10, fontStyle: 'italic', fontSize: 12, color: Colors.colorDark}}>Accept Chat Request</Text>
              )
              }
            </TouchableOpacity>
          :
          chatStatus == 0 && chatAcceptor != currentUserUID ?
            <Text style={{alignSelf: 'center', marginBottom: 10, fontStyle: 'italic', fontSize: 12, color: Colors.colorDark}}>{chatStatusText}</Text>
          : null
        )}
      />
      {/*{
        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
      }*/}
      {/*<ChatUI
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
      />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite
  },
});
