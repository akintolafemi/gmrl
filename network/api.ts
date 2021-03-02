import {NetworkResponse, LoginResponse, ReferralResponse} from '../interfaces/global';
import {AsyncStorage} from 'react-native';
import {requestClan} from './requests';
import * as firebase from 'firebase';
import FirebaseConfig from '../constants/FirebaseConfig';

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// Initialize Firebase

const firebaseConfig = FirebaseConfig;

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
   firebase.app(); // if already initialized, use that one
}

//firebase.analytics();

const BASE_URL = 'http://192.168.43.121:3000';
const URL_REGISTER = BASE_URL + '/user/register';
const URL_SEND_TOKEN = BASE_URL + '/user/token';
const URL_VERIFY_TOKEN = BASE_URL + '/user/token/verify';
const URL_LOGIN_USERNAME = BASE_URL + '/user/login/username';
const URL_LOGIN_PASSWORD = BASE_URL + '/user/login/password';
const URL_VERIFY_USERNAME = BASE_URL + '/user/register/validateusername';
const URL_REFERRAL = BASE_URL + '/user/referral';

async function login(data: LoginRequest): Promise<any> {
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password);
    return response;
  } catch (err) {
    console.log("There is something wrong!", err.message);
    return err.message;
  }
}

function isUser(){
  var user = firebase.auth().currentUser;
  if (user)
    return user;
  else
    return;
}

async function logout(): Promise<any> {
  try {
    const response = await firebase
      .auth()
      .signOut();

    await AsyncStorage.removeItem('gmrl');

    return "signedout";
  } catch (err) {
    console.log("There is something wrong!", err.message);
    return err.message;
  }
}

async function sendPasswordLink(emailAddress: string): Promise<any> {
  try {
    const response = await firebase
      .auth()
      .sendPasswordResetEmail(emailAddress);
      return "sent";
  } catch (err) {
    console.log("There is something wrong!", err.message);
    return err.message;
  }
}

async function getUserProfile(): Promise<any> {
  let currentUserUID = firebase.auth().currentUser.uid;

  let doc = await firebase
      .firestore()
      .collection('profiles')
      .doc(currentUserUID)
      .get();

  if (!doc.exists){
    return null;
  } else {
    let profileObj = doc.data();
    return profileObj;
  }
}

async function getUserBillingInfos(): Promise<any> {
  let currentUserUID = firebase.auth().currentUser.uid;

  let doc = await firebase
      .firestore()
      .collection('billing_infos')
      .doc(currentUserUID)
      .get();

  if (!doc.exists){
    return null;
  } else {
    let billingObj = doc.data();
    return billingObj;
  }
}

async function getConnections(): Promise<any> {
  let currentUserUID = firebase.auth().currentUser.uid;

  let connections = await firebase
      .firestore()
      .collection('profiles')
      .doc(currentUserUID)
      .collection('connections')
      .get();

  return connections.docs.map(doc => doc.data());
}

async function registerUser(data: RegisterRequest): Promise<any> {
  try {
    const response = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
    const result = await response;
    if (result.user) {
      const currentUser = firebase.auth().currentUser;

      const db = firebase.firestore();
      db.collection("profiles")
        .doc(currentUser.uid)
        .set({
          _id: currentUser.uid,
          email: currentUser.email,
          displayName: data.username,
          phoneNumber: data.mobile,
          photoURL: data.photoURL,
          about: '',
          fullname: data.fullname,
          dob: data.dob,
          gender: data.gender,
          genderInterest: data.genderInterest,
          country: data.country,
          city: data.city,
          profileLikes: 0,
          profileFriends: 0
        });

      db.collection("billing_infos")
        .doc(currentUser.uid)
        .set({
          'cards': [{

          }]
        });

      // db.collection("message_threads")
      //   .doc(currentUser.uid)
      //   .set({
      //     'team@getmereallove.com': [{
      //       type: 'text',
      //       content: 'hi/{se}\nThank you for joining Getmereallove',
      //       targetId: '12345678',
      //       renderTime: true,
      //       sendStatus: 1,
      //       time: new Date()
      //     }]
      //   });

      currentUser.sendEmailVerification().then(function() {
        console.log("Verification mail sent");
      }).catch(function(error) {
        console.log(error);
      });
    }
    return response;
  } catch (err) {
    console.log("There is something wrong!!!!", err.message);
    return err.message;
  }
}

async function getChats(owner): Promise<any> {
  let currentUserUID = firebase.auth().currentUser.uid;

  let chats = await firebase
      .firestore()
      .collection('message_threads')
      .where('_id', '==', currentUserUID)
      .where('owner', '==', owner)
      .get();

  let chatsObj = chats.docs.map(doc => doc.data());
  return chatsObj;
}

function getChatsUpdated(owner): Promise<any> {
  let currentUserUID = firebase.auth().currentUser.uid;

  let objChat = {
    type: -2
  };

  let chats = firebase
      .firestore()
      .collection('message_threads')
      .where('_id', '==', currentUserUID)
      .where('owner', '==', owner)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            objChat.type = 0;
          }
          else if (change.type === 'modified') {
            console.log("modified", change.doc.data());
            objChat.type = 1;
          }
          else if (change.type === 'removed') {
            objChat.type = -1;
          }
          objChat.newChat = change.doc.data();
          console.log("objChat///////////////////", objChat);

        });
      });

  return objChat;
}

function updloadDp(file: FileUpdloadRequest) {
  return new Promise((resolve, reject) => {
    try {
      uriToBlob(file.uri)
        .then((blob) => {
          let currentUserUID = firebase.auth().currentUser.uid;
          var storageRef = firebase.storage().ref();

          var metadata = {
            contentType: 'image/jpeg'
          };

          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = storageRef.child('displayimages/'+currentUserUID+'.jpg').put(blob, metadata);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            },
            (error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break;
                case 'storage/canceled':
                  // User canceled the upload
                  break;

                // ...

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebase
                  .firestore()
                  .collection('profiles')
                  .doc(currentUserUID)
                  .update({photoURL: downloadURL});

                resolve(downloadURL);
                // if (downloadURL)
                //   return downloadURL;
              });
            }
          );
        });
    }
    catch (err) {
      console.log("err", err);
      return "";
    }
  });
}

function uriToBlob(uri){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      // return the blob
      console.log("xhr", xhr.response);

      resolve(xhr.response);
    };

    xhr.onerror = function() {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };
    // this helps us get a blob
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);

    xhr.send(null);
  });
}

async function uriToBlobFetch(uri){
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
}

async function sendTokenMobile(mobile: string, captchaRef: any): Promise<any> {
  try {
    let res = {};
    let isPhone = await firebase
        .firestore()
        .collection('profiles')
        .where('phoneNumber', '==', mobile)
        .get();

    let isExist = isPhone.docs.map(doc => doc.data());
    console.log(isExist);

    if (isExist.length < 1) {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(mobile, captchaRef);
      res.verificationId = verificationId;
      res.code = "00";
    }
    else {
      res.code = "01";
      res.message = "Mobile number already used by another user";
    }
    return res;
  }
  catch (err) {
    console.log(err);
    let res = {
      code: "01",
      message: "Sorry, we could not verify your mobile number. Ensure your country code is appended"
    }
    return res;
  }
}

async function verifyTokenMobile(data: verifyRequest) {
  try {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      data.verificationId,
      data.verificationCode
    );
    await firebase.auth().signInWithCredential(credential);
    return true;
  }
  catch (error){
    console.lg(error);
    return false;
  }
}

function sendToken(data: TokenRequest): Promise<NetworkResponse> {
  return requestClan({
    data,
    type: 'POST',
    route: URL_SEND_TOKEN,
    isSecure: true,
  });
}

function verifyToken(data: TokenRequest): Promise<NetworkResponse> {
  return requestClan({
    data,
    type: 'POST',
    route: URL_VERIFY_TOKEN,
    isSecure: true,
  });
}

function verifyUsername(data: VFUsernameRequest): Promise<NetworkResponse> {
  return requestClan({
    data,
    type: 'POST',
    route: URL_VERIFY_USERNAME,
    isSecure: true,
  });
}

function getReferral(data: ReferralRequest): Promise<ReferralResponse> {
  return requestClan({
    data,
    type: 'POST',
    route: URL_REFERRAL,
    isSecure: true,
  });
}


export default {
  firebaseConfig,
  login,
  isUser,
  logout,
  registerUser,
  verifyUsername,
  sendToken,
  verifyToken,
  getReferral,
  getUserProfile,
  getConnections,
  getChats,
  getChatsUpdated,
  sendPasswordLink,
  updloadDp,
  uriToBlob,
  sendTokenMobile,
  verifyTokenMobile
}