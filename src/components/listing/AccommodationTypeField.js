import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ACCOMMODATION_TYPES } from '../../constants/listing';
import { colors, spacing, fonts } from '../../styles/theme';

export default function AccommodationTypeField({ value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Accommodation Type</Text>
      <Text style={styles.sectionSubtitle}>What are you renting out?</Text>
      <View style={styles.grid}>
        {ACCOMMODATION_TYPES.map((type) => {
          const selected = value === type.value;
          return (
            <TouchableOpacity
              key={type.value}
              style={[styles.typeCard, selected && styles.typeCardSelected]}
              onPress={() => onChange(type.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fonts.body,
    color: colors.grey,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.lightGrey,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeLabel: {
    fontSize: fonts.body,
    color: colors.grey,
    fontWeight: '500',
  },
  typeLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
});