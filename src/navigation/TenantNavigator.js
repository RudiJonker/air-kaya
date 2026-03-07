import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrowseScreen from '../screens/tenant/BrowseScreen';
import ListingDetailScreen from '../screens/tenant/ListingDetailScreen';
import { TENANT_SCREENS } from './NavigationConstants';

const Stack = createNativeStackNavigator();

export default function TenantNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={TENANT_SCREENS.BROWSE}          component={BrowseScreen} />
      <Stack.Screen name={TENANT_SCREENS.LISTING_DETAIL}  component={ListingDetailScreen} />
    </Stack.Navigator>
  );
}