import React, { useState, useEffect, useRef } from "react";
import { AsyncStorage, FlatList, Alert, SafeAreaView, StyleSheet, ScrollView, Animated, useWindowDimensions, Platform, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';

import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import TitleLabel from '../../components/TitleLabel';
import ProfileView from '../../components/ProfileView';
import {API} from '../../network';
import ToDateTime from '../../functions/ToDateTime';
import useProfile from '../../hooks/useProfile';

import * as Animatable from 'react-native-animatable';
import { useColorScheme  } from 'react-native';
import { Input, SocialIcon, Header, ListItem, Avatar } from 'react-native-elements';
import moment from 'moment';
import { Button as NButton, Picker as Picker, Item, Icon as NIcon, Fab } from 'native-base';

export default function FriendsScreen({navigation, route}) {

  const modalizeRef = useRef<Modalize>(null);
  const [profile, setProfile] = useState<Object>({});
  const [dob, setDob] = useState<Object>({});
  const [connectionsList, setConnectionList] = useState<Array>([]);
  const [selectedConnection, setSelectedConnection] = useState<Object>({});

  useEffect(() => {

    navigation.addListener('focus', () => {
      API.getConnections().then((data) => {
        console.log(data);

        if (data !== null)
          setConnectionList(data);
        else
          setConnectionList([]);
      });

      useProfile().then((data) => {
        if (data !== null) {
          setProfile(data)
          setDob(ToDateTime(data.dob.seconds));
          setConnectionList(data.connectionsList);
        }
        else {
          navigation.replace('Login');
        }
      });
    });

  }, [navigation]);

  const handleChat = (index) => {
    let obj = connectionsList[index];
    setSelectedConnection(obj);
    navigation.navigate('Chat', {selected: obj});
  }

  return (
    <View style={styles.container}>
      <Header
        placement="left"
        leftComponent={
          <Avatar
            rounded
            source={{
              uri: profile.photoURL,
            }}
            size="small"
          />
        }
        centerComponent={
          <Text style={{fontWeight: 'bold', fontSize: 15, color: Colors.colorWhite}}>{profile.displayName}</Text>
        }
        containerStyle={{
          height: 100,
        }}
        centerContainerStyle={{justifyContent: 'center'}}
        containerStyle={{paddingHorizontal: GlobalStyles.paddingH}}
        backgroundColor={Colors.primaryColor}
      />
      <SafeAreaView
        style={{flex: 1}}
      >
        <FlatList
          data={connectionsList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index.toString()} bottomDivider containerStyle={{paddingVertical: 10}}
              onPress={ () => handleChat(index)}
            >
              <ListItem
                key={index.toString()} bottomDivider containerStyle={{paddingVertical: 10}}
              >
                <Avatar source={{uri: item.photoURL}} rounded size="medium" />
                <ListItem.Content>
                  <ListItem.Title style={{fontWeight: '500'}}>{item.displayName}</ListItem.Title>
                  <ListItem.Subtitle style={{fontSize: 12}}>{item.location}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) =>  index.toString()}
        />
        <ScrollView>
        {/*connectionsList.map((connction, index) => (
          <ListItem key={index} bottomDivider style={{}}>
            <Avatar source={{uri: connction.photoURL}} rounded size="medium" />
            <ListItem.Content>
              <ListItem.Title>{connction.name}</ListItem.Title>
              <ListItem.Subtitle>{connction.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}*/}
        </ScrollView>
      </SafeAreaView>
      <Fab
        containerStyle={{}}
        style={{ backgroundColor: Colors.primaryColor, width: 45, height: 45 }}
        position="bottomRight"
      >
        <NIcon name="pencil" style={{fontSize: 15}} />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite
  },
});
