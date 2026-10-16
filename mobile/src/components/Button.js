import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, radius } from '../theme';

const VARIANTS = {
  filled: { bg: colors.primary, fg: colors.onPrimary, border: 'transparent' },
  tonal: { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, border: 'transparent' },
  outlined: { bg: 'transparent', fg: colors.primary, border: colors.outlineVariant },
  text: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
};

export default function Button({
  title,
  onPress,
  icon,
  disabled,
  loading,
  variant = 'filled',
  size = 'md',
  style,
}) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' && styles.large,
        { backgroundColor: v.bg, borderColor: v.border },
        inactive && variant === 'filled' && styles.filledDisabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.content}>
          {icon && <Icon name={icon} size={18} color={inactive ? colors.onSurfaceVariant : v.fg} />}
          <AppText variant="label" color={inactive ? colors.onSurfaceVariant : v.fg}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: { minHeight: 56 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filledDisabled: { backgroundColor: colors.surfaceContainerHigh },
  pressed: { opacity: 0.88 },
});
