import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH_SCREENS } from './NavigationConstants';
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import TermsScreen from '../screens/auth/TermsScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_SCREENS.SPLASH}   component={SplashScreen} />
      <Stack.Screen name={AUTH_SCREENS.WELCOME}  component={WelcomeScreen} />
      <Stack.Screen name={AUTH_SCREENS.TERMS}    component={TermsScreen} />
      <Stack.Screen name={AUTH_SCREENS.SIGNUP}   component={SignUpScreen} />
      <Stack.Screen name={AUTH_SCREENS.LOGIN}    component={LoginScreen} />
      <Stack.Screen name={AUTH_SCREENS.COMPLETE_PROFILE} component={CompleteProfileScreen} />
    </Stack.Navigator>
  );
}