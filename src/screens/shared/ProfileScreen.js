import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../utils/authService';
import { storageService } from '../../utils/storageService';
import LocationField from '../../components/common/LocationField';

export default function ProfileScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    province: profile?.province || '',
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    if (form.phone.trim()) {
      const cleaned = form.phone.replace(/\s/g, '');
      const saMobile = /^0[678][0-9]{8}$/;
      if (!saMobile.test(cleaned)) {
        Alert.alert(
          'Invalid Number',
          'Please enter a valid South African mobile number (e.g. 082 123 4567).'
        );
        return;
      }
    }

    if (!form.city.trim()) {
      Alert.alert('Required', 'Please enter your city.');
      return;
    }

    if (!form.province.trim()) {
      Alert.alert('Required', 'Please enter your province.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authService.updateProfile(user.id, {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await storageService.setUserProfile({
        ...profile,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
      });

      await refreshProfile();

      Alert.alert('Success! 🎉', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Could not update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Account Info */}
        <View style={styles.accountCard}>
          <Text style={styles.accountEmoji}>
            {profile?.role === 'landlord' ? '🏡' : '🔍'}
          </Text>
          <View>
            <Text style={styles.accountRole}>
              {profile?.role === 'landlord' ? 'Landlord Account' : 'Tenant Account'}
            </Text>
            <Text style={styles.accountEmail}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Form */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={form.full_name}
          onChangeText={(v) => updateField('full_name', v)}
          placeholder="Your full name"
          placeholderTextColor={colors.border}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(v) => updateField('phone', v)}
          placeholder="e.g. 082 123 4567"
          placeholderTextColor={colors.border}
          keyboardType="phone-pad"
        />

        <View style={styles.divider} />

        <LocationField
          city={form.city}
          province={form.province}
          onCityChange={(v) => updateField('city', v)}
          onProvinceChange={(v) => updateField('province', v)}
          onBothChange={(city, province) => {
            setForm(prev => ({ ...prev, city, province }));
          }}
        />

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? 'Saving...' : '💾 Save Changes'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />

      </ScrollView>
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
  headerTitle: { fontSize: fonts.large, fontWeight: 'bold', color: colors.white },
  scroll: { padding: spacing.lg },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  accountEmoji: { fontSize: 40 },
  accountRole: {
    fontSize: fonts.medium,
    fontWeight: '700',
    color: colors.primary,
  },
  accountEmail: {
    fontSize: fonts.small,
    color: colors.grey,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  label: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fonts.body,
    color: colors.dark,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.lg,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: colors.border },
  saveBtnText: {
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
});