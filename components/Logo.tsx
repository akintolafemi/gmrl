import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, Image } from 'react-native';

import Colors from '../constants/Colors';

export default function Logo(props) {
  return (
    <View {...props} style={[{width: 100, height: 42}, props.style]}>
      <Image
        source={props.source}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
}
