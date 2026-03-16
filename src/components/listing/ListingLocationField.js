import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '../../styles/theme';
import LocationField from '../common/LocationField';

export default function ListingLocationField({ value = {}, onChange }) {

  const handleBothFields = (cityVal, provinceVal, suburbVal) => {
    onChange({ ...value, city: cityVal, province: provinceVal, suburb: suburbVal || value.suburb || '' });
  };

  const updateCity = (val) => onChange({ ...value, city: val });
  const updateProvince = (val) => onChange({ ...value, province: val });
  const updateSuburb = (val) => onChange({ ...value, suburb: val });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Location</Text>
      <LocationField
        city={value.city || ''}
        province={value.province || ''}
        suburb={value.suburb || ''}
        onCityChange={updateCity}
        onProvinceChange={updateProvince}
        onSuburbChange={updateSuburb}
        onBothChange={handleBothFields}
        helpText="Tenants will search by suburb or city so make sure this is correct."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.large,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
  },
});