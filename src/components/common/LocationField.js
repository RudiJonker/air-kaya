import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ActivityIndicator, TextInput, Alert, StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import { colors, spacing, fonts, radius } from '../../styles/theme';

export default function LocationField({ city, province, onCityChange, onProvinceChange }) {
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
        const { city: detectedCity, region } = geocode[0];
        if (detectedCity) onCityChange(detectedCity);
        if (region) onProvinceChange(region);

        if (detectedCity || region) {
          Alert.alert('Location Detected', `City: ${detectedCity || '—'}\nProvince: ${region || '—'}`);
        } else {
          Alert.alert('Not Found', 'Could not detect your location. Please enter manually.');
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Could not get your location. Please enter manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
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
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={onCityChange}
        placeholder="e.g. Cape Town"
        placeholderTextColor={colors.border}
        autoCapitalize="words"
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fonts.body,
    color: colors.dark,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.lg,
  },
});