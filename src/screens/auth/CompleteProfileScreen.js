import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';
import { authService } from '../../utils/authService';
import { storageService } from '../../utils/storageService';
import { useAuth } from '../../contexts/AuthContext';
import { PROVINCES } from '../../constants/listing';
import LocationField from '../../components/common/LocationField';

export default function CompleteProfileScreen({ route }) {
  const { refreshProfile } = useAuth();
  
  const { userId, email, role } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  full_name: '',
  phone: '',
  city: '',
  province: '',
  suburb: '',
});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (!formData.full_name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    if (formData.phone.trim()) {
      const cleaned = formData.phone.replace(/\s/g, '');
      const saMobile = /^0[678][0-9]{8}$/;
      if (!saMobile.test(cleaned)) {
        Alert.alert(
          'Invalid Number',
          'Please enter a valid South African mobile number (e.g. 082 123 4567).'
        );
        return;
      }
    }

    if (!formData.city.trim()) {
      Alert.alert('Required', 'Please enter your city.');
      return;
    }

    if (!formData.province.trim()) {
      Alert.alert('Required', 'Please enter your province.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authService.updateProfile(userId, {
  full_name: formData.full_name.trim(),
  phone: formData.phone.trim(),
  suburb: formData.suburb.trim(),
  city: formData.city.trim(),
  province: formData.province.trim(),
  is_profile_complete: true,
  updated_at: new Date().toISOString(),
});

      if (error) throw error;

      await storageService.setUserProfile({
  id: userId,
  email,
  role,
  full_name: formData.full_name.trim(),
  phone: formData.phone.trim(),
  suburb: formData.suburb.trim(),
  city: formData.city.trim(),
  province: formData.province.trim(),
  is_profile_complete: true,
});

      await refreshProfile();

    } catch (error) {
      console.error('Complete profile error:', error);
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role === 'landlord' ? 'Landlord 🏡' : 'Tenant 🔍';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>

        <Text style={styles.intro}>
          Just a few details to get you started on Air Kaya.
        </Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          placeholderTextColor={colors.border}
          value={formData.full_name}
          onChangeText={(v) => updateField('full_name', v)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 082 123 4567"
          placeholderTextColor={colors.border}
          value={formData.phone}
          onChangeText={(v) => updateField('phone', v)}
          keyboardType="phone-pad"
        />

        <LocationField
  city={formData.city}
  province={formData.province}
  suburb={formData.suburb}
  onCityChange={(v) => updateField('city', v)}
  onProvinceChange={(v) => updateField('province', v)}
  onSuburbChange={(v) => updateField('suburb', v)}
  onBothChange={(city, province, suburb) => {
    setFormData(prev => ({ ...prev, city, province, suburb: suburb || prev.suburb }));
  }}
/>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Saving...' : "Let's Go →"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.white,
  },
  scroll: { padding: spacing.lg, paddingTop: spacing.xl },
  roleBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  roleBadgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fonts.body,
  },
  intro: {
    fontSize: fonts.body,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: spacing.xl,
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
  submitBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitBtnDisabled: { backgroundColor: colors.border },
  submitBtnText: {
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
});