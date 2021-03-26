import {NetworkResponse, LoginResponse, ReferralResponse} from '../interfaces/global';
import {AsyncStorage} from 'react-native';
import {requestClan} from './requests';
import * as firebase from 'firebase';
//import * as admin from 'firebase-admin';
import FirebaseConfig from '../constants/FirebaseConfig';
import PaystackConfig from '../constants/PaystackConfig';
import ConnectyCubeConfig from '../constants/ConnectyCubeConfig';
import RNPaystack from 'react-native-paystack';

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/"

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
const URL_REGISTER_CONNECTYCUBE = BASE_URL + '/user/registeronconnectycube';
const URL_LOGIN_CONNECTYCUBE = BASE_URL + '/user/loginonconnectycube';
const URL_SEND_TOKEN = BASE_URL + '/user/token';
const URL_VERIFY_TOKEN = BASE_URL + '/user/token/verify';
const URL_LOGIN_USERNAME = BASE_URL + '/user/login/username';
const URL_LOGIN_PASSWORD = BASE_URL + '/user/login/password';
const URL_VERIFY_USERNAME = BASE_URL + '/user/register/validateusername';
const URL_REFERRAL = BASE_URL + '/user/referral';

const URL_INITIALIZE_SUBSCRIPTION = 'https://api.paystack.co/transaction/initialize';
const PAYSTACK_AUTH = "Bearer " + PaystackConfig.secretKey;
const URL_VERIFY_CHARGE = "https://api.paystack.co/transaction/verify/:";


async function login(data: LoginRequest): Promise<any> {
  try {
    let con = await requestClan({
      data,
      type: 'POST',
      route: URL_LOGIN_CONNECTYCUBE,
      isSecure: true,
    });

    console.log(con);

    let response = await firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password);

    if (con.statuscode === 200) {
      response.connectyCube = con.user;
    }
    else {
      response.connectyCube = {};
    }
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
      .get('connectionsList');
//      .get();

  return connections.docs.map(doc => doc.data());
}

async function registerUser(data: RegisterRequest): Promise<any> {
  try {
    let con = await requestClan({
      data,
      type: 'POST',
      route: URL_REGISTER_CONNECTYCUBE,
      isSecure: true,
    });

    console.log(con);

    if (con.statuscode === 200) {

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
            connectionsList: [],
            subscriptionHistory: [],
            connectyCube: con.user
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
    }
    else {
      return "Could not register on connectyCube";
    }
  } catch (err) {
    console.log("There is something wrong!!!!", err.message);
    return err.message;
  }
}

async function getChats(messageThreadId): Promise<any> {
  try {
    let chats = await firebase
        .firestore()
        .collection('message_threads')
        .doc(messageThreadId)
        .get();

    let chatsObj = chats.data();
    return chatsObj.chats;
  }
  catch (err) {
    console.log(err);
    return [];
  }
}

async function updateChats(data: updateChatsRequest): Promise<Any> {
  try{
    const chatRef = firebase.firestore().collection('message_threads').doc(data.messageThreadId);

    let obj = data.messageObj;
    //obj.sent = true;

    await chatRef.update({
      chats: firebase.firestore.FieldValue.arrayUnion(obj)
    });
    return true;
  }
  catch(err) {
    console.log(err);
    return false;
  }
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
      message: err[0]
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

    await firebase.auth().currentUser.delete();

  // user.delete().then(function() {
  //   // User deleted.
  // }).catch(function(error) {
  //   // An error happened.
  // });
    return true;
  }
  catch (error){
    console.log(error);
    return false;
  }
}

function initPaystackSubscription(data: initRequest): Promise<Any>{
  return new Promise((resolve, reject) => {
    console.log(data);

    try{
      fetch(URL_INITIALIZE_SUBSCRIPTION, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
    		  "Authorization": PAYSTACK_AUTH
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then(json => {
            resolve(json);
        })
        .catch(error => {
          console.log(error);
          reject(new Error(error));
        })
    }
    catch(err) {
      console.log(err);
      reject(new Error(error));
    }
    return;
  });
}

function chargeCardPaystack(data: chargeRequest): Promise<Any>{
  return new Promise((resolve, reject) => {
    try {
      RNPaystack.init({
        publicKey: PaystackConfig.publicKey
      });
      RNPaystack.chargeCardWithAccessCode(data)
    	.then(response => {
    	  console.log("charge response: ", response); // do stuff with the token
        resolve(response);
    	})
    	.catch(error => {
    	  console.log(error); // error is a javascript Error object
    	  console.log(error.message);
    	  console.log(error.code);
        reject(new Error(error));
    	})
    }
    catch(err) {
      console.log(err);
      reject(new Error(err));
    }
    return;
  });
}

function verifyPaystackCharge(reference: string): Promise<Any>{
  return new Promise((resolve, reject) => {
    try{
      fetch(URL_VERIFY_CHARGE + reference, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
    		  "Authorization": PAYSTACK_AUTH
        }
      })
        .then((response) => {
            console.log("verify res: ", response);
            resolve(response);
        })
        .catch(error => {
          console.log(error);
          reject(new Error(error));
        })
    }
    catch(err) {
      console.log(err);
      reject(new Error(err));
    }
    return;
  });
}

async function savePaystackChargeRef(data: saveRequest){
  return new Promise((resolve, reject) => {
    try {
      const currentUser = firebase.auth().currentUser;

      const db = firebase.firestore();
      db.collection("paystack_payment_references")
        .doc(data.ref)
        .set({
          email: data.email,
          datetime: new Date(),
          uid: currentUser.uid
        });
      resolve(true);
    } catch (err) {
      console.log("There is something wrong!!!!", err.message);
      reject(false);
    }
    return;
  });
}

async function addSubscription(data: addSubscriptionRequest): Promise<Any> {
  let currentUserUID = firebase.auth().currentUser.uid;
  try{
    const subRef = firebase.firestore().collection('profiles').doc(currentUserUID);

    await subRef.update({
      subscriptionHistory: firebase.firestore.FieldValue.arrayUnion(data)
    });

    // firebase
    //   .firestore()
    //   .collection('profiles')
    //   .doc(currentUserUID)
    //   .update({subscriptionHistory: data});
    return true;
  }
  catch(err) {
    console.log(err);
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
  verifyTokenMobile,
  initPaystackSubscription,
  chargeCardPaystack,
  verifyPaystackCharge,
  savePaystackChargeRef,
  addSubscription,
  updateChats,
}
