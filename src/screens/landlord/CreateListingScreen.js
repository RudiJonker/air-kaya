import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { listingService } from '../../utils/listingService';
import AccommodationTypeField from '../../components/listing/AccommodationTypeField';
import UtilitiesField from '../../components/listing/UtilitiesField';
import AmenitiesField from '../../components/listing/AmenitiesField';
import PricingField from '../../components/listing/PricingField';
import ListingLocationField from '../../components/listing/ListingLocationField';
import PhotosField from '../../components/listing/PhotosField';
import { CONTACT_PREFS } from '../../constants/listing';

export default function CreateListingScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const [form, setForm] = useState({
    type: '',
    utilities: [],
    amenities: [],
    pricing: {
      price_amount: '',
      price_period: 'monthly',
      lease_period: 'month_to_month',
      max_occupants: 1,
      deposit: false,
      deposit_amount: '',
    },
    location: {
      city: '',
      province: '',
    },
    description: '',
    contact_pref: 'whatsapp',
    phone: '',
  });

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.type) {
      Alert.alert('Required', 'Please select an accommodation type.');
      return false;
    }
    if (!form.pricing.price_amount) {
      Alert.alert('Required', 'Please enter a rent amount.');
      return false;
    }
    if (!form.location.city.trim()) {
      Alert.alert('Required', 'Please enter the city.');
      return false;
    }
    if (!form.location.province.trim()) {
      Alert.alert('Required', 'Please enter the province.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const listingData = {
        landlord_id: user.id,
        type: form.type,
        utilities: form.utilities,
        amenities: form.amenities,
        price_amount: Number(form.pricing.price_amount),
        price_period: form.pricing.price_period,
        lease_period: form.pricing.lease_period,
        max_occupants: form.pricing.max_occupants,
        deposit: form.pricing.deposit,
        deposit_amount: form.pricing.deposit_amount
          ? Number(form.pricing.deposit_amount)
          : null,
        city: form.location.city.trim(),
        province: form.location.province.trim(),
        description: form.description.trim(),
        contact_pref: form.contact_pref,
        phone: form.phone.trim(),
        status: 'active',
      };

      const { data: listing, error } = await listingService.createListing(listingData);
      if (error) throw error;

      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          await listingService.uploadImage(listing.id, photos[i], i);
        }
      }

      Alert.alert('Success! 🎉', 'Your listing has been published.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Create listing error:', error);
      Alert.alert('Error', 'Could not publish listing. Please try again.');
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
        <Text style={styles.headerTitle}>New Listing</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <AccommodationTypeField
          value={form.type}
          onChange={(v) => updateForm('type', v)}
        />

        <View style={styles.divider} />

        <UtilitiesField
          value={form.utilities}
          onChange={(v) => updateForm('utilities', v)}
        />

        <View style={styles.divider} />

        <AmenitiesField
          value={form.amenities}
          onChange={(v) => updateForm('amenities', v)}
        />

        <View style={styles.divider} />

        <PricingField
          value={form.pricing}
          onChange={(v) => updateForm('pricing', v)}
        />

        <View style={styles.divider} />

        <ListingLocationField
          value={form.location}
          onChange={(v) => updateForm('location', v)}
        />

        <View style={styles.divider} />

        <PhotosField
          value={photos}
          onChange={setPhotos}
        />

        <View style={styles.divider} />

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={form.description}
          onChangeText={(v) => updateForm('description', v)}
          placeholder="Describe your space — what makes it a good home?"
          placeholderTextColor={colors.border}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.charCount}>{form.description.length}/500</Text>

        <View style={styles.divider} />

        {/* Contact Preference */}
        <Text style={styles.sectionTitle}>How should tenants contact you?</Text>
        <View style={styles.contactRow}>
          {CONTACT_PREFS.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[
                styles.contactOption,
                form.contact_pref === c.value && styles.contactOptionSelected
              ]}
              onPress={() => updateForm('contact_pref', c.value)}
            >
              <Text style={[
                styles.contactOptionText,
                form.contact_pref === c.value && styles.contactOptionTextSelected
              ]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Your Contact Number</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(v) => updateForm('phone', v)}
          placeholder="e.g. 082 123 4567"
          placeholderTextColor={colors.border}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Publishing...' : '🚀 Publish Listing'}
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.large,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
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
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fonts.body,
    color: colors.dark,
    backgroundColor: colors.lightGrey,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: fonts.small,
    color: colors.grey,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  contactRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  contactOption: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
  },
  contactOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  contactOptionText: {
    fontSize: fonts.small,
    color: colors.grey,
    fontWeight: '500',
  },
  contactOptionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
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