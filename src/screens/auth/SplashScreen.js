import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export default function SplashScreen() {
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
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryMid,
    marginTop: 8,
    letterSpacing: 1,
  },
});