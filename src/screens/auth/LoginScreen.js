import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts, radius } from '../../styles/theme';
import { authService } from '../../utils/authService';
import { storageService } from '../../utils/storageService';

export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    Alert.alert('Missing Fields', 'Please enter your email and password.');
    return;
  }

  setLoading(true);
  try {
    const { data, error } = await authService.signIn(formData.email, formData.password);
    if (error) throw error;
    // AppNavigator handles routing automatically via AuthContext
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log In</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoBlock}>
          <Text style={styles.logoEmoji}>🏠</Text>
          <Text style={styles.logoText}>AIR KAYA</Text>
        </View>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor={colors.border}
          value={formData.email}
          onChangeText={(v) => updateField('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Your password"
          placeholderTextColor={colors.border}
          value={formData.password}
          onChangeText={(v) => updateField('password', v)}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotBtnText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>
            {loading ? 'Logging In...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.signupLinkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
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
  scroll: { padding: spacing.lg, paddingTop: spacing.xl },
  logoBlock: { alignItems: 'center', marginBottom: spacing.xl },
  logoEmoji: { fontSize: 48, marginBottom: spacing.xs },
  logoText: {
    fontSize: fonts.xxlarge,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
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
  forgotBtn: {
  marginTop: spacing.sm,
  alignItems: 'center',
  padding: spacing.sm,
},
forgotBtnText: {
  color: colors.primary,
  fontSize: fonts.body,
  fontWeight: '600',
},
  loginBtnDisabled: { backgroundColor: colors.border },
  loginBtnText: { color: colors.white, fontSize: fonts.medium, fontWeight: 'bold' },
  signupLink: { alignItems: 'center' },
  signupLinkText: { color: colors.primary, fontSize: fonts.body, fontWeight: '600' },
});