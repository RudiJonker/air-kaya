import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';

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
          Welcome to Air Kaya. Please read and accept our terms before creating your account. Last updated: March 2026.
        </Text>

        {[
          {
            title: '1. About Air Kaya',
            body: 'Air Kaya is a platform that connects landlords offering informal accommodation with tenants looking for affordable places to stay. Air Kaya acts as a connector only — we are not a party to any rental agreement between landlords and tenants.',
          },
          {
            title: '2. Consumer Protection',
            body: 'As required by section 49 of the Consumer Protection Act, 68 of 2008 ("CPA"), your attention is drawn to provisions in these Terms which limit the liability of Air Kaya, constitute an assumption of risk by you, or impose obligations to indemnify Air Kaya. If you do not understand any provision, contact Air Kaya for clarity before accepting. No provision is intended to unlawfully restrict any right created under the CPA.',
          },
          {
            title: '3. Your Responsibilities',
            body: 'By using Air Kaya you agree to: provide accurate and truthful information; take responsibility for all content you post; treat all users with respect and dignity; not post illegal, obscene, defamatory, discriminatory, or offensive content; not engage in illegal activity through the platform; not attempt unauthorised access to Air Kaya systems or other users\' accounts; and not use automated processes to negatively affect platform performance.',
          },
          {
            title: '4. Access and Use',
            body: 'The content of the Air Kaya platform is proprietary to Air Kaya. You may download content for personal use only without removing any copyright or trademark notices. You may not copy, reproduce, republish, or distribute platform content without prior written permission. Air Kaya reserves the right to modify or discontinue any aspect of the platform at any time without prior notice or compensation.',
          },
          {
            title: '5. Landlord Rules',
            body: 'Landlords must accurately describe their accommodation including all relevant details, photos and pricing. Listings must represent real, available spaces that you have the right to rent. Landlords are responsible for complying with all applicable local laws regarding rental of accommodation and must respond to tenant enquiries in good faith.',
          },
          {
            title: '6. Tenant Rules',
            body: 'Tenants must use the platform in good faith. Any rental agreement made with a landlord is directly between you and the landlord. Air Kaya is not responsible for the condition, safety, or suitability of any accommodation listed. Tenant contact details obtained through the platform may not be used for any purpose other than legitimate accommodation enquiries.',
          },
          {
            title: '7. Payments',
            body: 'Air Kaya does not process or handle any payments between landlords and tenants. All payment arrangements are made directly between the parties involved. Air Kaya accepts no liability for any financial disputes, losses, or fraudulent transactions that may arise between landlords and tenants.',
          },
          {
            title: '8. Privacy and Data',
            body: 'Air Kaya collects only the information necessary to operate the platform. Your personal information will not be sold to third parties. Location data is used only to show relevant listings in your area. You agree not to violate the privacy of any person or process personal data of third parties through the platform without their consent.',
          },
          {
            title: '9. Advertising',
            body: 'The Air Kaya platform displays third-party advertisements served by Google AdMob. These advertisements help keep the platform free for all users. Air Kaya does not control the content of these advertisements and is not responsible for any products or services advertised. By using the platform you acknowledge and consent to the display of such advertisements.',
          },
          {
            title: '10. Account Termination',
            body: 'Air Kaya reserves the right to suspend or terminate any account, without prior notice, that violates these Terms, is used in a manner harmful to other users or the platform, engages in fraudulent or illegal activity, or posts false or misleading content. Air Kaya reserves the right to recover costs incurred and report conduct to relevant law enforcement authorities.',
          },
          {
            title: '11. Amendments to These Terms',
            body: 'Air Kaya reserves the right to amend these Terms at any time. Changes become effective upon being posted to the platform. Your continued use of the platform represents your agreement to be bound by the updated Terms. We recommend you regularly review these Terms when using the platform.',
          },
          {
            title: '12. Limitation of Liability',
            body: 'Air Kaya provides the platform on an "as is" basis. To the fullest extent permitted by law, Air Kaya disclaims all liability for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including the condition or safety of any listed accommodation, disputes between landlords and tenants, financial losses from rental agreements, or any interruption or termination of the platform.',
          },
          {
            title: '13. Safety and Personal Security',
            body: 'Air Kaya strongly advises all users to exercise caution when sharing personal information or meeting unknown persons. Air Kaya accepts no liability for any criminal acts, personal injury, theft, or harm arising from interactions between users facilitated through the platform. Users interact with each other entirely at their own risk. Always meet in public places first and inform a trusted person before visiting any accommodation.',
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
    borderRadius: 4,
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
    borderRadius: 8,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: colors.border },
  continueBtnText: { color: colors.white, fontSize: fonts.medium, fontWeight: 'bold' },
});