import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '../../styles/theme';
import LocationField from '../common/LocationField';

export default function ListingLocationField({ value = {}, onChange }) {

  const handleBothFields = (cityVal, provinceVal) => {
    onChange({ ...value, city: cityVal, province: provinceVal });
  };

  const updateCity = (val) => {
    onChange({ ...value, city: val });
  };

  const updateProvince = (val) => {
    onChange({ ...value, province: val });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Location</Text>
      <LocationField
        city={value.city || ''}
        province={value.province || ''}
        onCityChange={updateCity}
        onProvinceChange={updateProvince}
        onBothChange={handleBothFields}
        helpText="Tenants will search by city so make sure this is correct."
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