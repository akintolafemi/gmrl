import Colors from './Colors';
import { Platform, Dimensions } from 'react-native';

const DEVICE_SCALE = Dimensions.get('window').width / 375;
const DEVICE_SCALE_HEIGHT = Dimensions.get('window').height / 768;

function normalize(size: number): number {
    return MAth.round(DEVICE_SCALE * size);
}

export default {
    h: (size: number): number => Math.round(DEVICE_SCALE_HEIGHT * size),
    w: normalize,
    paddingArround: 20,
    paddingH: 20,
    paddingV: 20,
    paddingR: 20,
    paddingL: 20,
    paddingT: 20,
    paddingB: 20,
    inputStyle: {
      height: 40,
      paddingHorizontal: 15,
      marginVertical: 5,
      fontSize: 12
    },
    buttonStyle: {
      elevation: 15,
      marginVertical: 5,
      height: 40,
      backgroundColor: Colors.primaryColor,
    },
    buttonRoundMStyle: {
      backgroundColor: Colors.primaryColor,
      paddingHorizontal: 15,
      borderRadius: 20,
      marginTop: 10
    },
    RNEHeaderContainer: {
      backgroundColor: Colors.colorWhite,
      height: 120,
    },
    buttonPaddingH: 15,
    buttonRadius: 20,
    borderRadius: 10,
    iconStyle: {
      fontSize: 15
    },
    inputBorderRadius: 20,
};
