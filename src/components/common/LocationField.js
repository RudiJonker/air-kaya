import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ActivityIndicator, TextInput, Alert, StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import { colors, spacing, fonts } from '../../styles/theme';
import CityAutocomplete from './CityAutocomplete';

export default function LocationField({ city, province, onCityChange, onProvinceChange, onBothChange, helpText = 'This helps show relevant listings in your area.' }) {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Location access helps find listings near you. You can still enter your city manually.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const { city: geoCity, subregion, district, region } = geocode[0];
        const detectedCity = geoCity || subregion || district;
        const detectedProvince = region;

        if (onBothChange) {
          onBothChange(detectedCity || '', detectedProvince || '');
        } else {
          if (detectedCity) onCityChange(detectedCity);
          if (detectedProvince) onProvinceChange(detectedProvince);
        }

        setTimeout(() => {
          if (detectedCity || detectedProvince) {
            Alert.alert('Location Detected', `City: ${detectedCity || '—'}\nProvince: ${detectedProvince || '—'}`);
          } else {
            Alert.alert('Not Found', 'Could not detect your location. Please enter manually.');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Could not get your location. Please enter manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>Location</Text>
        <TouchableOpacity onPress={getCurrentLocation} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Text style={styles.detectLink}>📍 Auto-detect</Text>
          }
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>City / Town *</Text>
      <CityAutocomplete
        value={city}
        placeholder="e.g. Cape Town"
        onSelectCity={(selectedCity, selectedProvince) => {
          if (selectedProvince && onBothChange) {
            onBothChange(selectedCity, selectedProvince);
          } else {
            onCityChange(selectedCity);
          }
        }}
      />

      <Text style={styles.label}>Province *</Text>
      <TextInput
        style={styles.input}
        value={province}
        onChangeText={onProvinceChange}
        placeholder="e.g. Western Cape"
        placeholderTextColor={colors.border}
        autoCapitalize="words"
      />

      <Text style={styles.helpText}>{helpText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: fonts.medium,
    fontWeight: '700',
    color: colors.dark,
  },
  detectLink: {
    fontSize: fonts.body,
    fontWeight: '500',
    color: colors.primary,
  },
  label: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fonts.body,
    color: colors.dark,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: fonts.small,
    color: colors.grey,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});