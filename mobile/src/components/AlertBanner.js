import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { gravite } from '../constants';
import { colors, elevation, radius } from '../theme';

// Alerte affichée quand un autre usager vient de signaler un embouteillage.
export default function AlertBanner({ reports, onOpen, onDismiss }) {
  const latest = reports[0];
  if (!latest) return null;
  const g = gravite(latest.gravite);
  const others = reports.length - 1;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onOpen}
        style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
        accessibilityRole="alert"
      >
        <View style={[styles.iconWrap, { backgroundColor: g.container }]}>
          <Icon name="bell-ring-outline" size={20} color={g.color} />
        </View>
        <View style={styles.text}>
          <AppText variant="titleSmall" numberOfLines={1}>
            Nouvel embouteillage signalé
          </AppText>
          <AppText variant="bodySmall" color={colors.onSurfaceVariant} numberOfLines={1}>
            {latest.lieu} · {g.label}
            {others > 0 ? ` · +${others} autre${others > 1 ? 's' : ''}` : ''}
          </AppText>
        </View>
        <Pressable
          onPress={onDismiss}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Fermer l'alerte"
          style={styles.close}
        >
          <Icon name="close" size={20} />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 8 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...elevation.card,
  },
  pressed: { backgroundColor: colors.surfaceContainerLow },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  close: { padding: 4 },
});
