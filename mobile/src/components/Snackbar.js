import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, elevation, radius } from '../theme';

// Message de confirmation éphémère, affiché au-dessus de la barre de navigation.
export default function Snackbar({ message, icon = 'check-circle-outline' }) {
  if (!message) return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.snackbar} accessibilityLiveRegion="polite">
        <Icon name={icon} size={20} color={colors.inverseOnSurface} />
        <AppText variant="bodySmall" color={colors.inverseOnSurface} style={styles.text}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, bottom: 16 },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.inverseSurface,
    ...elevation.raised,
  },
  text: { flex: 1 },
});
