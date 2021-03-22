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
import { Button as NButton, Picker as Picker, Item, Icon as NIcon, Fab, Col, Row, Grid } from 'native-base';

export default function StoriesScreen({navigation, route}) {

  const modalizeRef = useRef<Modalize>(null);
  const [profile, setProfile] = useState<Object>({});
  const [dob, setDob] = useState<Object>({});
  const [connectionsList, setConnectionList] = useState<Array>([]);
  const [selectedConnection, setSelectedConnection] = useState<Object>({});

  useEffect(() => {

    navigation.addListener('focus', () => {
      API.getConnections().then((data) => {

        if (data !== null)
          setConnectionList(data);
        else
          setConnectionList([]);
      });

      useProfile().then((data) => {
        if (data !== null) {
          setProfile(data)
          setDob(ToDateTime(data.dob.seconds));
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
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
        <Grid>
          <Col style={{ backgroundColor: '#635DB7', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
          <Col style={{ backgroundColor: '#00CE9F', height: Math.floor(Math.random() * (400 - 200) ) + 200 }}></Col>
        </Grid>
      </SafeAreaView>
      <Fab
        containerStyle={{}}
        style={{ backgroundColor: Colors.primaryColor, width: 45, height: 45 }}
        position="bottomRight"
      >
        <NIcon name="cloud-upload" style={{fontSize: 15}} />
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
