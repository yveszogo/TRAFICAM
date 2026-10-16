import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, fonts, radius } from '../theme';

// Champ de saisie "outlined" Material 3 avec libellé et icône optionnelle.
export default function TextField({ label, icon, helper, style, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      {label && (
        <AppText variant="labelSmall" color={colors.onSurfaceVariant} style={styles.label}>
          {label}
        </AppText>
      )}
      <View style={[styles.field, focused && styles.focused]}>
        {icon && <Icon name={icon} size={20} color={focused ? colors.primary : colors.onSurfaceVariant} />}
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={colors.outline}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
        />
      </View>
      {helper && (
        <AppText variant="bodySmall" color={colors.onSurfaceVariant} style={styles.helper}>
          {helper}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, marginLeft: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  focused: { borderColor: colors.primary, borderWidth: 2, paddingHorizontal: 15 },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.onSurface,
    paddingVertical: 14,
    outlineStyle: 'none',
  },
  helper: { marginTop: 6, marginLeft: 4 },
});
