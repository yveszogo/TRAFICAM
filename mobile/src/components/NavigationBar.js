import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';
import Icon from './Icon';
import { colors, radius } from '../theme';

// Barre de navigation du bas (Material 3). Les autres membres de l'équipe
// ajoutent leurs onglets (Carte, Itinéraire, Profil…) dans le tableau TABS de App.js.
export default function NavigationBar({ tabs, current, onChange }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {tabs.map((tab) => {
        const active = tab.key === current;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <View style={[styles.indicator, active && styles.indicatorActive]}>
              <Icon
                name={active ? tab.iconActive : tab.icon}
                size={24}
                color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant}
              />
            </View>
            <AppText
              variant="labelSmall"
              color={active ? colors.onSurface : colors.onSurfaceVariant}
              style={active && styles.labelActive}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    paddingTop: 12,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  indicator: {
    width: 64,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorActive: { backgroundColor: colors.secondaryContainer },
  labelActive: { fontFamily: 'Inter_600SemiBold' },
});
