import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import BrandMark from '../components/BrandMark';
import Button from '../components/Button';
import Icon from '../components/Icon';
import TextField from '../components/TextField';
import { colors, radius } from '../theme';

// Connexion simplifiée (nom + numéro). L'inscription complète avec code SMS
// et choix du profil correspond à la story US-04.
export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      await onLogin(phone, name);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <BrandMark size={64} />
          <AppText variant="headline" style={styles.title}>
            Bienvenue sur Traficam
          </AppText>
          <AppText variant="body" color={colors.onSurfaceVariant} style={styles.center}>
            Signalez les embouteillages et profitez des alertes de la communauté pour circuler plus
            sereinement.
          </AppText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Nom"
            icon="account-outline"
            value={name}
            onChangeText={setName}
            placeholder="Votre nom"
            autoCapitalize="words"
            autoComplete="name"
            maxLength={40}
          />
          <TextField
            label="Numéro de téléphone"
            icon="phone-outline"
            value={phone}
            onChangeText={setPhone}
            placeholder="+237 6XX XX XX XX"
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={20}
          />

          {error && (
            <View style={styles.error}>
              <Icon name="alert-circle-outline" size={18} color={colors.onErrorContainer} />
              <AppText variant="bodySmall" color={colors.onErrorContainer} style={styles.flex}>
                {error}
              </AppText>
            </View>
          )}

          <Button
            title="Continuer"
            size="lg"
            onPress={submit}
            loading={loading}
            disabled={name.trim().length < 2 || phone.trim().length < 8}
            style={styles.submit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { alignItems: 'center', marginBottom: 40 },
  title: { marginTop: 24, marginBottom: 8, textAlign: 'center' },
  center: { textAlign: 'center' },
  form: { gap: 20 },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.errorContainer,
  },
  submit: { marginTop: 8 },
});
