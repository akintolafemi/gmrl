import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon } from 'native-base';
import { Avatar } from 'react-native-elements';

export default function UsersProfileGrid(props) {

  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={{alignItems: 'center'}}>
        <Avatar
          rounded
          source={{
            uri: 'https://randomuser.me/api/portraits/men/41.jpg',
          }}
          size={props.avatarSize}
        />
      </View>
      <View style={{alignItems: 'center', marginBottom: 20, marginTop: 10}}>
        <Text style={{fontSize: 14, fontWeight: 'bold' }}>{props.username}</Text>
        <Text style={{fontSize: 12, color: Colors.colorDark}}>{props.city}, {props.country}</Text>
      </View>
      <View style={styles.viewRow}>
        {props.dataArray.map((item, index) => {
          return (
            <View
              key={index.toString()}
              style={{alignItems: 'center'}}
            >
              <NIcon name={item.icon} style={{fontSize: 18, color: Colors.primaryColor, marginBottom: 5}} />
              <Text style={{fontSize: 10, color: Colors.colorDark}}>{item.title}</Text>
              <Text style={{fontSize: 12, color: Colors.colorDark, fontWeight: 'bold'}}>{item.count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: Colors.colorWhite,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
