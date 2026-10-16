import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import BrandMark from './BrandMark';
import Icon from './Icon';
import { colors, radius } from '../theme';

export default function TopAppBar({ userName, onLogout }) {
  const initial = (userName || '?').trim().charAt(0).toUpperCase();
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <BrandMark size={32} />
        <AppText variant="titleLarge">Traficam</AppText>
      </View>
      <View style={styles.actions}>
        <View style={styles.avatar} accessibilityLabel={`Connecté en tant que ${userName}`}>
          <AppText variant="label" color={colors.onPrimaryContainer}>
            {initial}
          </AppText>
        </View>
        <Pressable
          onPress={onLogout}
          accessibilityRole="button"
          accessibilityLabel="Se déconnecter"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Icon name="logout" size={22} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.surfaceContainerHigh },
});
