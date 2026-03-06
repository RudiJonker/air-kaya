import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts, radius } from '../../styles/theme';

export default function TermsScreen({ navigation, route }) {
  const { role } = route.params;
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.intro}>
          Welcome to Air Kaya. Please read and accept our terms before creating your account.
        </Text>

        {[
          {
            title: '1. About Air Kaya',
            body: 'Air Kaya is a platform that connects landlords offering informal accommodation with tenants looking for affordable places to stay. Air Kaya acts as a connector only — we are not a party to any rental agreement between landlords and tenants.',
          },
          {
            title: '2. Your Responsibilities',
            body: 'You agree to provide accurate and truthful information in your profile and listings. You are responsible for all content you post on the platform. You agree to treat all other users with respect and dignity.',
          },
          {
            title: '3. Landlord Rules',
            body: 'Landlords must accurately describe their accommodation. Listings must represent real, available spaces. Landlords are responsible for complying with all applicable local laws regarding rental of accommodation.',
          },
          {
            title: '4. Tenant Rules',
            body: 'Tenants must use the platform in good faith. Any agreement made with a landlord is directly between you and the landlord. Air Kaya is not responsible for the condition of any accommodation listed on the platform.',
          },
          {
            title: '5. Payments',
            body: 'Air Kaya does not process or handle any payments between landlords and tenants. All payment arrangements are made directly between the parties involved.',
          },
          {
            title: '6. Privacy',
            body: 'We collect only the information needed to operate the platform. Your personal information will not be sold to third parties. Location data is used only to show relevant listings near you.',
          },
          {
            title: '7. Account Termination',
            body: 'Air Kaya reserves the right to suspend or terminate any account that violates these terms or that is used in a manner harmful to other users or the platform.',
          },
        ].map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setAccepted(!accepted)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>I have read and accept the Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueBtn, !accepted && styles.continueBtnDisabled]}
          disabled={!accepted}
          onPress={() => navigation.navigate('SignUp', { role })}
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backBtn: { width: 60 },
  backText: { color: colors.white, fontSize: fonts.body },
  headerTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.white,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  intro: {
    fontSize: fonts.body,
    color: colors.grey,
    lineHeight: 22,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: fonts.medium,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    fontSize: fonts.body,
    color: colors.dark,
    lineHeight: 22,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.primary },
  checkmark: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
  checkLabel: { flex: 1, fontSize: fonts.body, color: colors.dark, lineHeight: 20 },
  continueBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: colors.border },
  continueBtnText: { color: colors.white, fontSize: fonts.medium, fontWeight: 'bold' },
});