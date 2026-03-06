import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts, radius } from '../../styles/theme';

export default function WelcomeScreen({ navigation }) {
  const handleRoleSelect = (role) => {
    navigation.navigate('Terms', { role });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Green header block */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🏠</Text>
        <Text style={styles.appName}>AIR KAYA</Text>
        <Text style={styles.tagline}>Find or list informal accommodation</Text>
      </View>

      {/* White card body */}
      <View style={styles.body}>
        <Text style={styles.chooseLabel}>How will you use Air Kaya?</Text>

        <View style={styles.roleRow}>
          {/* Landlord */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelect('landlord')}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.roleEmoji}>🏡</Text>
            </View>
            <Text style={styles.roleTitle}>Landlord</Text>
            <Text style={styles.roleDesc}>Renting out{'\n'}a space</Text>
            <View style={styles.roleButton}>
              <Text style={styles.roleButtonText}>List a Space</Text>
            </View>
          </TouchableOpacity>

          {/* Tenant */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelect('tenant')}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.roleEmoji}>🔍</Text>
            </View>
            <Text style={styles.roleTitle}>Tenant</Text>
            <Text style={styles.roleDesc}>I am looking{'\n'}for a place</Text>
            <View style={styles.roleButton}>
              <Text style={styles.roleButtonText}>Find a Space</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
  backgroundColor: colors.primary,
  alignItems: 'center',
  paddingTop: spacing.md,        // was spacing.xl
  paddingBottom: spacing.lg,     // was spacing.xl
},
emoji: {
  fontSize: 48,                  // was 56
  marginBottom: spacing.xs,
},
appName: {
  fontSize: 30,                  // was 36
  fontWeight: 'bold',
  color: colors.white,
  letterSpacing: 4,
},
tagline: {
  fontSize: fonts.small,         // was fonts.body
  color: colors.primaryMid,
  marginTop: spacing.xs,
  letterSpacing: 0.5,
},
body: {
  flex: 1,
  backgroundColor: colors.white,
  borderTopLeftRadius: radius.xl,
  borderTopRightRadius: radius.xl,
  padding: spacing.lg,
  paddingTop: spacing.lg,        // was spacing.xl
},
chooseLabel: {
  fontSize: fonts.medium,        // was fonts.large
  fontWeight: '700',
  color: colors.dark,
  textAlign: 'center',
  marginBottom: spacing.md,      // was spacing.lg
},
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleCard: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleIconCircle: {
    width: 60,
    height: 60,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  roleEmoji: {
    fontSize: 28,
  },
  roleTitle: {
    fontSize: fonts.medium,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  roleDesc: {
    fontSize: fonts.small,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  roleButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  roleButtonText: {
    color: colors.white,
    fontSize: fonts.small,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: fonts.body,
    color: colors.grey,
  },
  loginLink: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.primary,
  },
});