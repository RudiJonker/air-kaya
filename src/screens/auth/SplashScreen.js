import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../styles/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏠</Text>
      <Text style={styles.title}>AIR KAYA</Text>
      <Text style={styles.subtitle}>Informal accommodation marketplace</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64, marginBottom: spacing.md },
  title: {
    fontSize: fonts.xxlarge + 8,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.primaryMid,
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
});