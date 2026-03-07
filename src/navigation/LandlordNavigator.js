import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/landlord/DashboardScreen';
import CreateListingScreen from '../screens/landlord/CreateListingScreen';
import EditListingScreen from '../screens/landlord/EditListingScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import { LANDLORD_SCREENS, SHARED_SCREENS } from './NavigationConstants';

const Stack = createNativeStackNavigator();

export default function LandlordNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={LANDLORD_SCREENS.DASHBOARD}      component={DashboardScreen} />
      <Stack.Screen name={LANDLORD_SCREENS.CREATE_LISTING} component={CreateListingScreen} />
      <Stack.Screen name={LANDLORD_SCREENS.EDIT_LISTING}   component={EditListingScreen} />
      <Stack.Screen name={SHARED_SCREENS.PROFILE}          component={ProfileScreen} />
    </Stack.Navigator>
  );
}