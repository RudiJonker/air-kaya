import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UTILITIES } from '../../constants/listing';
import { colors, spacing, fonts } from '../../styles/theme';

export default function UtilitiesField({ value = [], onChange }) {
  const toggle = (item) => {
    const updated = value.includes(item)
      ? value.filter((v) => v !== item)
      : [...value, item];
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Utilities</Text>
      <Text style={styles.sectionSubtitle}>What's included with the space?</Text>
      {UTILITIES.map((u) => {
        const selected = value.includes(u.value);
        return (
          <TouchableOpacity
            key={u.value}
            style={[styles.row, selected && styles.rowSelected]}
            onPress={() => toggle(u.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{u.icon}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {u.label}
            </Text>
            <View style={[styles.toggle, selected && styles.toggleSelected]}>
              <Text style={styles.toggleText}>{selected ? '✓' : ''}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.sm,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: fonts.body,
    color: colors.grey,
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});