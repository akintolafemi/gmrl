import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import TitleLabel from '../components/TitleLabel';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon } from 'native-base';
import { Avatar } from 'react-native-elements';

export default function ProfileView(props) {

  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={{alignItems: 'center'}}>
        <Avatar
          rounded
          source={{
            uri: props.avatarUri,
          }}
          size={props.avatarSize}
          onPress={props.avartarPress}
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
      <View style={{marginTop: 10}}>
        <TitleLabel title='About' size={15} weight='500' />
        <Text style={{color: Colors.colorDark, fontSize: 10, marginTop: 2}}>Interested in {props.genderInterest}</Text>
        <Text style={{color: Colors.colorDark, fontSize: 12, marginTop: 5}}>{props.about}</Text>
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
