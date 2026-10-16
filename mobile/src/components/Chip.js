import { Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, radius } from '../theme';

// "Filter chip" Material 3 : coche à gauche quand il est sélectionné.
export default function Chip({ label, icon, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Icon
        name={selected ? 'check' : icon}
        size={18}
        color={selected ? colors.onSecondaryContainer : colors.onSurfaceVariant}
      />
      <AppText variant="label" color={selected ? colors.onSecondaryContainer : colors.onSurfaceVariant}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  selected: { backgroundColor: colors.secondaryContainer, borderColor: colors.secondaryContainer },
  pressed: { opacity: 0.85 },
});
