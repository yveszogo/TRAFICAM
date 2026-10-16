import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import AppText from '../components/AppText';
import Button from '../components/Button';
import Chip from '../components/Chip';
import Icon from '../components/Icon';
import TextField from '../components/TextField';
import { api } from '../api';
import { CAUSES, GRAVITES } from '../constants';
import { colors, elevation, radius } from '../theme';

// US-05 : signaler un embouteillage (lieu, cause, gravité).
export default function SignalerScreen({ token, onCreated, onPosition }) {
  const [position, setPosition] = useState(null);
  const [locStatus, setLocStatus] = useState('loading'); // loading | ok | denied | error
  const [lieu, setLieu] = useState('');
  const [cause, setCause] = useState(null);
  const [causeAutre, setCauseAutre] = useState('');
  const [graviteValue, setGraviteValue] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // La position GPS est remplie automatiquement ; le nom du lieu est proposé puis modifiable.
  const locate = useCallback(async () => {
    setLocStatus('loading');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocStatus('denied');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setPosition(coords);
      onPosition?.(coords);
      setLocStatus('ok');

      if (Platform.OS !== 'web') {
        try {
          const [address] = await Location.reverseGeocodeAsync(coords);
          const guess = [address?.street || address?.name, address?.district || address?.city]
            .filter(Boolean)
            .join(', ');
          if (guess) setLieu((current) => current || guess);
        } catch {
          // Pas d'adresse trouvée : l'utilisateur saisit le lieu lui-même.
        }
      }
    } catch {
      setLocStatus('error');
    }
  }, [onPosition]);

  useEffect(() => {
    locate();
  }, [locate]);

  const canSend =
    position &&
    lieu.trim().length >= 2 &&
    cause &&
    (cause !== 'autre' || causeAutre.trim().length >= 2) &&
    graviteValue;

  async function submit() {
    setError(null);
    setSending(true);
    try {
      const report = await api.createReport(token, {
        latitude: position.latitude,
        longitude: position.longitude,
        lieu: lieu.trim(),
        cause,
        causeAutre: cause === 'autre' ? causeAutre.trim() : undefined,
        gravite: graviteValue,
      });
      setLieu('');
      setCause(null);
      setCauseAutre('');
      setGraviteValue(null);
      onCreated(report);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText variant="headline">Signaler un embouteillage</AppText>
        <AppText variant="body" color={colors.onSurfaceVariant} style={styles.intro}>
          Votre signalement sera visible immédiatement par les autres usagers.
        </AppText>

        <Section step={1} title="Localisation">
          <LocationStatus status={locStatus} position={position} onRetry={locate} />
          <TextField
            label="Nom du lieu"
            icon="map-marker-outline"
            value={lieu}
            onChangeText={setLieu}
            placeholder="Ex. : Carrefour Warda, Poste centrale"
            maxLength={120}
          />
        </Section>

        <Section step={2} title="Cause">
          <View style={styles.chips}>
            {CAUSES.map((c) => (
              <Chip
                key={c.value}
                label={c.label}
                icon={c.icon}
                selected={cause === c.value}
                onPress={() => setCause(c.value)}
              />
            ))}
          </View>
          {cause === 'autre' && (
            <TextField
              label="Précisez la cause"
              icon="pencil-outline"
              value={causeAutre}
              onChangeText={setCauseAutre}
              placeholder="Ex. : cortège officiel"
              maxLength={80}
            />
          )}
        </Section>

        <Section step={3} title="État de la circulation">
          <View style={styles.gravites}>
            {GRAVITES.map((g) => {
              const selected = graviteValue === g.value;
              return (
                <Pressable
                  key={g.value}
                  onPress={() => setGraviteValue(g.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [
                    styles.gravite,
                    selected && { borderColor: g.color, backgroundColor: g.container },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.graviteIcon, { backgroundColor: selected ? g.color : g.container }]}>
                    <Icon name={g.icon} size={22} color={selected ? colors.onPrimary : g.color} />
                  </View>
                  <View style={styles.graviteText}>
                    <AppText variant="title" color={selected ? g.color : colors.onSurface}>
                      {g.label}
                    </AppText>
                    <AppText variant="bodySmall" color={colors.onSurfaceVariant}>
                      {g.description}
                    </AppText>
                  </View>
                  <View style={[styles.radio, selected && { borderColor: g.color }]}>
                    {selected && <View style={[styles.radioDot, { backgroundColor: g.color }]} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {error && (
          <View style={styles.error}>
            <Icon name="alert-circle-outline" size={18} color={colors.onErrorContainer} />
            <AppText variant="bodySmall" color={colors.onErrorContainer} style={styles.flex}>
              {error}
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Envoyer le signalement"
          icon="send-outline"
          size="lg"
          onPress={submit}
          loading={sending}
          disabled={!canSend}
        />
      </View>
    </View>
  );
}

function Section({ step, title, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.step}>
          <AppText variant="labelSmall" color={colors.onPrimaryContainer}>
            {step}
          </AppText>
        </View>
        <AppText variant="title">{title}</AppText>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function LocationStatus({ status, position, onRetry }) {
  if (status === 'loading') {
    return (
      <View style={styles.locRow}>
        <ActivityIndicator size="small" color={colors.primary} />
        <AppText variant="bodySmall" color={colors.onSurfaceVariant}>
          Recherche de votre position…
        </AppText>
      </View>
    );
  }
  if (status === 'ok') {
    return (
      <View style={styles.locRow}>
        <Icon name="crosshairs-gps" size={18} color={colors.success} />
        <AppText variant="bodySmall" color={colors.onSurfaceVariant}>
          Position détectée · {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
        </AppText>
      </View>
    );
  }
  return (
    <View style={styles.locError}>
      <View style={styles.locRow}>
        <Icon name="map-marker-off-outline" size={20} color={colors.onErrorContainer} />
        <AppText variant="bodySmall" color={colors.onErrorContainer} style={styles.flex}>
          {status === 'denied'
            ? "L'accès à votre position est nécessaire pour situer l'embouteillage."
            : 'Position introuvable. Vérifiez que la localisation est activée.'}
        </AppText>
      </View>
      <Button title="Réessayer" icon="refresh" variant="outlined" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 16 },
  intro: { marginTop: -8 },
  section: {
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: 16,
    ...elevation.card,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionBody: { gap: 16 },
  step: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locError: {
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.errorContainer,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gravites: { gap: 12 },
  gravite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  graviteIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graviteText: { flex: 1, gap: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  pressed: { opacity: 0.9 },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.errorContainer,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
});
