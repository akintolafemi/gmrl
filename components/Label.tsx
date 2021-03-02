import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, Text } from 'react-native';

import Colors from '../constants/Colors';

export default function Label(props) {
  return (
    <View>
      <Text style={{color: props.color, fontSize: props.size, alignSelf: props.position, marginVertical: props.marginV}}>{props.title}</Text>
    </View>
  );
}
