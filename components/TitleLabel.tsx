import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, Text } from 'react-native';

import Colors from '../constants/Colors';

export default function TitleLabel(props) {
  return (
    <View {...props}>
      <Text style={{color: Colors.colorDark, fontSize: props.size, fontWeight: props.weight}}>{props.title}</Text>
      <View style={{backgroundColor: Colors.primaryColor, height: props.barHeight, width: props.barWidth}}></View>
    </View>
  );
}
