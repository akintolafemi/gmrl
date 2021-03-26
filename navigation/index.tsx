import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LoginScreen from '../screens/login/';
import SignUpScreen from '../screens/signup/';
import VerifyScreen from "../screens/signup/VerifyScreen";
import FinalSetupScreen from "../screens/signup/FinalSetupScreen";
import SetDPScreen from '../screens/signup/SetDPScreen';
import ForgotPasswordScreen from '../screens/password/forgotpasswordscreen';

import ChatScreen from '../screens/friends/ChatScreen';
import CallScreen from '../screens/friends/CallScreen';

//billing
import SetupBillingCardScreen from '../screens/billing/SetupBillingCardScreen';
import SubscribeScreen from '../screens/billing/SubscribeScreen';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import Colors from '../constants/Colors';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
      >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{
          headerShown: false
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="VerifyMobile"
        component={VerifyScreen}
        options={{
          headerShown: true,
          title: 'Verify Mobile',
          headerTintColor: Colors.colorDark,
          headerStyle: {
            backgroundColor: Colors.colorWhite,
          },
        }}
      />
      <Stack.Screen
        name="FinalSetup"
        component={FinalSetupScreen}
        options={{
          headerShown: true,
          title: 'Final Step',
          headerTintColor: Colors.colorDark,
          headerStyle: {
            backgroundColor: Colors.colorWhite,
          },
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{
          headerShown: false
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="SetupBillingCard"
        component={SetupBillingCardScreen}
        options={{
          headerShown: true,
          title: 'Billing Details',
          headerLeft: null,
          headerTintColor: Colors.colorDark,
          headerStyle: {
            backgroundColor: Colors.colorWhite,
          },
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="Subscribe"
        component={SubscribeScreen}
        options={{
          headerShown: true,
          title: 'Subscribe',
          headerLeft: null,
          headerTintColor: Colors.colorDark,
          headerStyle: {
            backgroundColor: Colors.colorWhite,
          },
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="SetDP"
        component={SetDPScreen}
        options={{
          headerShown: true,
          title: 'Set Display Image',
          headerLeft: null,
          headerTintColor: Colors.colorDark,
          headerStyle: {
            backgroundColor: Colors.colorWhite,
          },
        }}
        initialParams={{}}
      />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
