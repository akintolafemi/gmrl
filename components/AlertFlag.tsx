import React, {FunctionComponent} from 'react';
import {View, Text, Image, StyleProp, TextStyle, ViewStyle} from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

const AlertFlag: FunctionComponent<{
  message?: string;
  source?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  type?: 'notice';
  customRender? : any;
}> = ({message, source, textStyle, containerStyle, type, customRender}) => {
  console.log(customRender)
  if(customRender){
    return (<View>{customRender}</View>);
  }
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: Colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          borderRadius: GlobalStyles.borderRadius,
          paddingHorizontal: GlobalStyles.paddingH,
          paddingVertical: GlobalStyles.paddingV,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.095,
          shadowRadius: 10.84,
          elevation: 2,
        },
        containerStyle,
      ]}>
      <View
        style={[
          {
            flexDirection: 'row',
            backgroundColor: Colors.colorWhite,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        {!!source && type === 'notice' ? (
          <View
            style={{
              alignSelf: 'flex-start',
              paddingRight: GlobalStyles.paddingR,
              paddingTop: GlobalStyles.paddingT,
            }}>
            <Image
              source={source}
              style={{height: GlobalStyles.w(16), width: GlobalStyles.w(16)}}
            />
          </View>
        ) : null}
        <Text
          style={[
            {
              fontFamily: GlobalStyles.AVERTA_REGULAR,
              GlobalStylesize: GlobalStyles.w(13),
              lineHeight: GlobalStyles.h(25),
              color: Colors.defaultText,
              marginRight: GlobalStyles.w(3),
            },
            textStyle,
          ]}>
          {message}
        </Text>
        {!!source && type !== 'notice' ? (
          <Image
            source={source}
            style={{height: GlobalStyles.w(30), width: GlobalStyles.w(30)}}
          />
        ) : null}
      </View>
    </View>
  );
};

export default AlertFlag;
