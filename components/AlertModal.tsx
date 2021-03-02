import React, {​​​​​​​​
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
}​​​​​​​​ from'react';
import {​​​​​​​​
  Text,
  Animated,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  Platform,
  ViewStyle,
  Dimensions,
  StyleProp,
  TextStyle,
  ImageSourcePropType,
  Image,
  ImageStyle,
}​​​​​​​​ from'react-native';
import {​​​​​​​​ Fonts }​​​​​​​​ from'src/common';

const {​​​​​​​​height, width}​​​​​​​​ = Dimensions.get('window');

typeProps = {​​​​​​​​
  show?: boolean;
  useNativeDriver?: boolean;
  onDismiss?: () =>void;
  onCancelPressed?: () =>void;
  onConfirmPressed?: () =>void;
  closeOnTouchOutside?: boolean;
  showProgress?: boolean;
  closeOnHardwareBackPress?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  customView?: string;
  modalProps?: any;
  title?: string;
  message?: string;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  confirmButtonStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  cancelButtonTextStyle?: StyleProp<TextStyle>;
  confirmButtonTextStyle?: StyleProp<TextStyle>;
  alertContainerStyle?: StyleProp<ViewStyle>;
  image?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
}​​​​​​​​;

export interface alertRef {​​​​​​​​
  toggle(): void;
  showModal(obj: {​​​​​​​​title: string; message: string}​​​​​​​​): void;
}​​​​​​​​

// TODO: Add on close ref
const AlertModal: ForwardRefRenderFunction<alertRef, Props> = (
  {​​​​​​​​
    show = false,
    useNativeDriver = false,
    onDismiss,
    closeOnTouchOutside = true,
    showProgress = false,

    closeOnHardwareBackPress = true,
    showCancelButton = false,
    showConfirmButton = false,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    cancelButtonColor = '#D0D0D0',
    confirmButtonColor = '#AEDEF4',
    modalProps = {​​​​​​​​}​​​​​​​​,
    cancelButtonStyle,
    cancelButtonTextStyle,
    onCancelPressed,
    title,
    message,
    customView = null,

    confirmButtonStyle,
    confirmButtonTextStyle,
    onConfirmPressed,
    alertContainerStyle,
    overlayStyle,
    progressSize,
    progressColor,
    contentContainerStyle,
    contentStyle,
    titleStyle,
    messageStyle,
    actionContainerStyle,
    image,
    imageStyle,
    }​​​​​​​​,
    ref,
  ) => {​​​​​​​​
    const springValue = useRef(newAnimated.Value(0.3)).current;
    const [showSelf, setShowSelf] = useState(false);
    const [showState, setShowState] = useState(true);
    const [messageState, setMessageState] = useState<string | undefined>('');
    const [titleState, setTitleState] = useState<string | undefined>('');

  useEffect(() => {​​​​​​​​
    if (show) springShow(true);
  }​​​​​​​​, [show]);

  useEffect(() => {​​​​​​​​
    setMessageState(message);
    setTitleState(title);
  }​​​​​​​​, [message, title]);

  useImperativeHandle(ref, () => ({​​​​​​​​
    toggle: () => {​​​​​​​​
      //   itemSelected(index);
      if(showSelf){​​​​​​​​
        springHide();
      }​​​​​​​​else{​​​​​​​​
        setShowSelf(true);
        springShow(true);
      }​​​​​​​​
    }​​​​​​​​,

    showModal: (data) => {​​​​​​​​
      setMessageState(data.message);
      setTitleState(data.title);
      setShowSelf(true);
      // setShowState(true);
      setTimeout(() => {​​​​​​​​
        springShow(true);
      }​​​​​​​​, 100);
    }​​​​​​​​,
  }​​​​​​​​));

  function springShow(fromEffect?: boolean) {​​​​​​​​
    console.log(">>>>>>sa")
    toggleAlert(fromEffect);
    Animated.spring(springValue, {​​​​​​​​
      toValue:1,
      bounciness:10,
      useNativeDriver,
    }​​​​​​​​).start();
  }​​​​​​​​

  function springHide() {​​​​​​​​
    if (showSelf === true) {​​​​​​​​
      Animated.spring(springValue, {​​​​​​​​
        toValue:0,
        tension:10,
        useNativeDriver,
      }​​​​​​​​).start();

      setTimeout(() => {​​​​​​​​
        toggleAlert();
        handleOnDismis();
      }​​​​​​​​, 70);
    }​​​​​​​​
  }​​​​​​​​

  function toggleAlert(fromConstructor?: boolean) {​​​​​​​​
    if (fromConstructor) setShowSelf(true);
    else setShowSelf((sSelf) => !sSelf);
  }​​​​​​​​

  function onTapOutside() {​​​​​​​​
    if (closeOnTouchOutside) springHide();
  }​​​​​​​​

  function handleOnDismis() {​​​​​​​​
    onDismiss && onDismiss();
  }​​​​​​​​

  function renderButton(data: any) {​​​​​​​​
    const {​​​​​​​​text, backgroundColor, buttonStyle, buttonTextStyle, onPress}​​​​​​​​ = data;

    return (
      <TouchableOpacityonPress={​​​​​​​​onPress}​​​​​​​​>
        <View
          style={​​​​​​​​[
            {​​​​​​​​
              paddingHorizontal:10,
              paddingVertical:7,
              margin:5,
              borderRadius:5,
            }​​​​​​​​,
            {​​​​​​​​backgroundColor}​​​​​​​​,
            buttonStyle,
          ]}​​​​​​​​>
          <Text
            style={​​​​​​​​[
              {​​​​​​​​
                color:'#fff',
                fontSize:13,
              }​​​​​​​​,
              buttonTextStyle,
          ]}​​​​​​​​>
            {​​​​​​​​text}​​​​​​​​
          </Text>
        </View>
      </TouchableOpacity>
    );
  }​​​​​​​​

  function renderAlert() {​​​​​​​​
    const animation = {​​​​​​​​transform: [{​​​​​​​​scale:springValue}​​​​​​​​]}​​​​​​​​;

    const cancelButtonData = {​​​​​​​​
      text:cancelText,
      backgroundColor:cancelButtonColor,
      buttonStyle:cancelButtonStyle,
      buttonTextStyle:cancelButtonTextStyle,
      onPress:onCancelPressed,
    }​​​​​​​​;

    const confirmButtonData = {​​​​​​​​
      text:confirmText,
      backgroundColor:confirmButtonColor,
      buttonStyle:confirmButtonStyle,
      buttonTextStyle:confirmButtonTextStyle,
      onPress:onConfirmPressed,
    }​​​​​​​​;

    return (
      <View
        style={​​​​​​​​[
          {​​​​​​​​
            flex:1,
            width:'100%',
            height:'100%',
            alignItems:'center',
            justifyContent:'center',
            position:'absolute',
          }​​​​​​​​,
          alertContainerStyle,
        ]}​​​​​​​​>
        <TouchableWithoutFeedbackonPress={​​​​​​​​onTapOutside}​​​​​​​​>
          <View
            style={​​​​​​​​[
              {​​​​​​​​
                width:width,
                height:height,
                position:'absolute',
                backgroundColor:'rgba(52,52,52,0.5)',
              }​​​​​​​​,
              overlayStyle,
            ]}​​​​​​​​
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={​​​​​​​​[
            {​​​​​​​​
              borderRadius:Fonts.w(15),
              backgroundColor:'white',
              padding:Fonts.w(10),
            }​​​​​​​​,
            animation,
            contentContainerStyle,
          ]}​​​​​​​​>
          <View
            style={​​​​​​​​[
              {​​​​​​​​
                justifyContent:'center',
                alignItems:'center',
                padding:10,
              }​​​​​​​​,
              contentStyle,
            ]}​​​​​​​​>
            {​​​​​​​​showProgress ? (
              <ActivityIndicatorsize={​​​​​​​​progressSize}​​​​​​​​color={​​​​​​​​progressColor}​​​​​​​​/>
            ) : null}​​​​​​​​
            {​​​​​​​​image ? <Imagestyle={​​​​​​​​[imageStyle]}​​​​​​​​source={​​​​​​​​image}​​​​​​​​/> : null}​​​​​​​​
            {​​​​​​​​titleState ? (
              <Text
                style={​​​​​​​​[
                  {​​​​​​​​
                    paddingVertical:5,
                    paddingHorizontal:15,
                    color:'#626262',
                    fontSize:18,
                  }​​​​​​​​,
                  titleStyle,
                ]}​​​​​​​​>
                {​​​​​​​​titleState}​​​​​​​​
              </Text>
            ) : null}​​​​​​​​
            {​​​​​​​​messageState ? (
              <Text
                style={​​​​​​​​[
                  {​​​​​​​​
                    paddingTop:5,
                    color:'#7b7b7b',
                    fontSize:14,
                  }​​​​​​​​,
                  messageStyle,
                ]}​​​​​​​​>
                {​​​​​​​​messageState}​​​​​​​​
              </Text>
            ) : null}​​​​​​​​
            {​​​​​​​​customView}​​​​​​​​
          </View>
          <View
            style={​​​​​​​​[
              {​​​​​​​​
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'flex-end',
                marginTop:5,
              }​​​​​​​​,
              actionContainerStyle,
            ]}​​​​​​​​>
            {​​​​​​​​showCancelButton ? renderButton(cancelButtonData) : null}​​​​​​​​
            {​​​​​​​​showConfirmButton ? renderButton(confirmButtonData) : null}​​​​​​​​
          </View>
        </Animated.View>
      </View>
    );
  }​​​​​​​​

  return showSelf ? (
    <Modal
      animationType="none"
      transparent={​​​​​​​​true}​​​​​​​​
      visible={​​​​​​​​showSelf}​​​​​​​​
      onRequestClose={​​​​​​​​() => {​​​​​​​​
        if (showSelf && closeOnHardwareBackPress) {​​​​​​​​
          springHide();
        }​​​​​​​​
      }​​​​​​​​}​​​​​​​​
      {​​​​​​​​...modalProps}​​​​​​​​>
      {​​​​​​​​renderAlert()}​​​​​​​​
    </Modal>
  ) : null;
}​​​​​​​​;

export default forwardRef(AlertModal);
