import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LEASE_PERIODS } from '../../constants/listing';
import { colors, spacing, fonts } from '../../styles/theme';

export default function PricingField({ value = {}, onChange }) {
  const update = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pricing & Availability</Text>

      <Text style={styles.label}>Rent Amount (ZAR) *</Text>
      <TextInput
        style={styles.input}
        value={value.price_amount ? String(value.price_amount) : ''}
        onChangeText={(v) => update('price_amount', v.replace(/[^0-9]/g, ''))}
        placeholder="e.g. 1200"
        placeholderTextColor={colors.border}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Billing Period</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.price_period || 'monthly'}
          onValueChange={(v) => update('price_period', v)}
          style={styles.picker}
        >
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Weekly"  value="weekly" />
        </Picker>
      </View>

      <Text style={styles.label}>Lease Period</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.lease_period || 'month_to_month'}
          onValueChange={(v) => update('lease_period', v)}
          style={styles.picker}
        >
          {LEASE_PERIODS.map((l) => (
            <Picker.Item key={l.value} label={l.label} value={l.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Max Occupants</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value.max_occupants || 1}
          onValueChange={(v) => update('max_occupants', v)}
          style={styles.picker}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Picker.Item key={n} label={`${n} ${n === 1 ? 'person' : 'people'}`} value={n} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.depositRow}
        onPress={() => update('deposit', !value.deposit)}
        activeOpacity={0.7}
      >
        <View style={[styles.toggle, value.deposit && styles.toggleSelected]}>
          <Text style={styles.toggleText}>{value.deposit ? '✓' : ''}</Text>
        </View>
        <Text style={styles.depositLabel}>Deposit Required</Text>
      </TouchableOpacity>

      {value.deposit && (
        <>
          <Text style={styles.label}>Deposit Amount (ZAR)</Text>
          <TextInput
            style={styles.input}
            value={value.deposit_amount ? String(value.deposit_amount) : ''}
            onChangeText={(v) => update('deposit_amount', v.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 1200"
            placeholderTextColor={colors.border}
            keyboardType="numeric"
          />
        </>
      )}
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  picker: {
    color: colors.dark,
  },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  depositLabel: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: spacing.sm,
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