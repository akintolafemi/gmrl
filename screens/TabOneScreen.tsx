import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import {API} from '../network';

export default function TabOneScreen() {

  useEffect(() => {


  }, []);

  async function login() {
    const res = await API.login({email: 'michealakintola106.pog@gmail.com', password: '1234asdf'});
    console.log(res);

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity
        onPress={login}
      >
      <Text>Login</Text>
      </TouchableOpacity>
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
