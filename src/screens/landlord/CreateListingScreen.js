import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';
import AccommodationTypeField from '../../components/listing/AccommodationTypeField';
import UtilitiesField from '../../components/listing/UtilitiesField';
import AmenitiesField from '../../components/listing/AmenitiesField';
import PricingField from '../../components/listing/PricingField';
import ListingLocationField from '../../components/listing/ListingLocationField';

export default function CreateListingScreen({ navigation }) {
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
});

  
  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

        {/* Add divider and UtilitiesField here */}
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
  placeholder: { fontSize: fonts.body, color: colors.grey },
  
  // Add divider style here
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});