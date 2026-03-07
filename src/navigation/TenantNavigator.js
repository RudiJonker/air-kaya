import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrowseScreen from '../screens/tenant/BrowseScreen';
import ListingDetailScreen from '../screens/tenant/ListingDetailScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import { TENANT_SCREENS, SHARED_SCREENS } from './NavigationConstants';

const Stack = createNativeStackNavigator();

export default function TenantNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={TENANT_SCREENS.BROWSE}          component={BrowseScreen} />
      <Stack.Screen name={TENANT_SCREENS.LISTING_DETAIL}  component={ListingDetailScreen} />
      <Stack.Screen name={SHARED_SCREENS.PROFILE}         component={ProfileScreen} />
    </Stack.Navigator>
  );
}