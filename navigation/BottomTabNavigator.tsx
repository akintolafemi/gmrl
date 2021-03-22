import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LandingScreen from '../screens/landing';
import FriendsScreen from '../screens/friends';
import StoriesScreen from '../screens/stories';
import { BottomTabParamList, LandingParamList, FriendsParamList, StoriesParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Landing"
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        tabStyle: {
          backgroundColor: Colors.colorWhite
        }
      }}>
      <BottomTab.Screen
        name="Landing"
        component={LandingNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Friends"
        component={FriendsNavigator}
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Stories"
        component={StoriesNavigator}
        options={{
          title: 'Stories',
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={20} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const LandingStack = createStackNavigator<LandingParamList>();

function LandingNavigator() {
  return (
    <LandingStack.Navigator>
      <LandingStack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
    </LandingStack.Navigator>
  );
}

const FriendsStack = createStackNavigator<FriendsParamList>();

function FriendsNavigator() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{ headerShown: false }}
      />
    </FriendsStack.Navigator>
  );
}

const StoriesStack = createStackNavigator<StoriesParamList>();

function StoriesNavigator() {
  return (
    <StoriesStack.Navigator>
      <StoriesStack.Screen
        name="StoriesScreen"
        component={StoriesScreen}
        options={{ headerShown: false }}
      />
    </StoriesStack.Navigator>
  );
}
