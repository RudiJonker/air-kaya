import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, Image
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

export default function EditListingScreen({ navigation, route }) {
  const { listing } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Pre-populate form with existing listing data
  const [form, setForm] = useState({
    type: listing.type || '',
    utilities: listing.utilities || [],
    amenities: listing.amenities || [],
    pricing: {
      price_amount: listing.price_amount ? String(listing.price_amount) : '',
      price_period: listing.price_period || 'monthly',
      lease_period: listing.lease_period || 'month_to_month',
      max_occupants: listing.max_occupants || 1,
      deposit: listing.deposit || false,
      deposit_amount: listing.deposit_amount ? String(listing.deposit_amount) : '',
    },
    location: {
  suburb: listing.suburb || '',
  city: listing.city || '',
  province: listing.province || '',
},
    description: listing.description || '',
    contact_pref: listing.contact_pref || 'whatsapp',
    phone: listing.phone || '',
  });

  // Existing photos from database
  const [existingPhotos] = useState(
    listing.listing_images
      ? listing.listing_images
          .sort((a, b) => a.order_index - b.order_index)
          .map(img => img.url)
      : []
  );

  // New photos picked from device
  const [newPhotos, setNewPhotos] = useState([]);

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

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const updates = {
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
        suburb: form.location.suburb.trim(),
city: form.location.city.trim(),
province: form.location.province.trim(),
        description: form.description.trim(),
        contact_pref: form.contact_pref,
        phone: form.phone.trim(),
      };

      const { error } = await listingService.updateListing(listing.id, updates);
      if (error) throw error;

      // Upload any new photos
      if (newPhotos.length > 0) {
        const startIndex = existingPhotos.length;
        for (let i = 0; i < newPhotos.length; i++) {
          await listingService.uploadImage(listing.id, newPhotos[i], startIndex + i);
        }
      }

      Alert.alert('Success! 🎉', 'Your listing has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Edit listing error:', error);
      Alert.alert('Error', 'Could not update listing. Please try again.');
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
        <Text style={styles.headerTitle}>Edit Listing</Text>
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

        {/* Existing Photos */}
{existingPhotos.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Current Photos</Text>
    <Text style={styles.sectionSubtitle}>
      To remove photos, delete the listing and create a new one.
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      style={styles.existingPhotosRow}>
      {existingPhotos.map((url, index) => (
        <View key={index} style={styles.existingPhotoThumb}>
          <Image
            source={{ uri: url }}
            style={styles.existingPhotoImage}
            resizeMode="cover"
          />
          {index === 0 && (
            <View style={styles.coverBadge}>
              <Text style={styles.coverBadgeText}>Cover</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
    <View style={styles.divider} />
  </>
)}

        {/* Add New Photos */}
<PhotosField
  value={newPhotos}
  onChange={setNewPhotos}
  existingCount={existingPhotos.length}
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
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
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
  sectionSubtitle: {
    fontSize: fonts.body,
    color: colors.grey,
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
  existingPhotosRow: {
    marginBottom: spacing.md,
  },
  existingPhotoThumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  existingPhoto: {
    fontSize: 32,
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  coverBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
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
  existingPhotoImage: {
  width: '100%',
  height: '100%',
  borderRadius: 8,
},
});