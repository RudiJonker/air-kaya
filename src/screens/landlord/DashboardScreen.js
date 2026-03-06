import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';
import { authService } from '../../utils/authService';
import { storageService } from '../../utils/storageService';

export default function DashboardScreen({ navigation }) {
  const handleSignOut = async () => {
    await authService.signOut();
    await storageService.clearUserProfile();
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏡 Landlord Dashboard</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>Listings will appear here.</Text>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.white,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  placeholder: {
    fontSize: fonts.body,
    color: colors.grey,
    marginBottom: spacing.xl,
  },
  signOutBtn: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  signOutText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fonts.body,
  },
});