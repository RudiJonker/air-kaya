import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import LandlordNavigator from './LandlordNavigator';
import TenantNavigator from './TenantNavigator';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  

  // Not logged in — show auth flow
  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    );

  }

  // Logged in but profile incomplete — go to CompleteProfile
  if (!profile?.is_profile_complete) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          initialParams={{
            userId: user.id,
            email: user.email,
            role: profile?.role,
          }}
        />
      </Stack.Navigator>
    );
  }

  // Logged in and profile complete — go to correct main app
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {profile.role === 'landlord'
        ? <Stack.Screen name="LandlordMain" component={LandlordNavigator} />
        : <Stack.Screen name="TenantMain"   component={TenantNavigator} />
      }
    </Stack.Navigator>
  );
}