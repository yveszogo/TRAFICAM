import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import Icon from '../components/Icon';
import ReportCard from '../components/ReportCard';
import { GRAVITES } from '../constants';
import { distanceMetres } from '../format';
import { colors, radius } from '../theme';

// Liste des embouteillages signalés par tous les usagers.
// La carte avec code couleur (US-03) pourra réutiliser les mêmes données (useReports).
export default function TraficScreen({ reports, error, refreshing, onRefresh, userId, position }) {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(r) => r.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <AppText variant="headline">Trafic en temps réel</AppText>
          <AppText variant="body" color={colors.onSurfaceVariant}>
            Signalements de la communauté, mis à jour automatiquement.
          </AppText>

          <View style={styles.stats}>
            {GRAVITES.slice()
              .reverse()
              .map((g) => (
                <View key={g.value} style={[styles.stat, { backgroundColor: g.container }]}>
                  <Icon name={g.icon} size={20} color={g.color} />
                  <AppText variant="titleLarge" color={g.color}>
                    {reports.filter((r) => r.gravite === g.value).length}
                  </AppText>
                  <AppText variant="labelSmall" color={g.color}>
                    {g.label}
                  </AppText>
                </View>
              ))}
          </View>

          {error && (
            <View style={styles.error}>
              <Icon name="wifi-off" size={18} color={colors.onErrorContainer} />
              <AppText variant="bodySmall" color={colors.onErrorContainer} style={styles.flex}>
                {error}
              </AppText>
            </View>
          )}

          {reports.length > 0 && (
            <AppText variant="overline" color={colors.onSurfaceVariant} style={styles.section}>
              Signalements actifs
            </AppText>
          )}
        </View>
      }
      ListEmptyComponent={
        !error && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Icon name="check-decagram-outline" size={32} color={colors.success} />
            </View>
            <AppText variant="title">Circulation fluide</AppText>
            <AppText variant="body" color={colors.onSurfaceVariant} style={styles.center}>
              Aucun embouteillage signalé pour le moment.
            </AppText>
          </View>
        )
      }
      renderItem={({ item }) => (
        <ReportCard
          report={item}
          isMine={item.auteur.id === userId}
          distance={
            position
              ? distanceMetres(position.latitude, position.longitude, item.latitude, item.longitude)
              : null
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 },
  header: { gap: 4, marginBottom: 8 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 16 },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.lg,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginTop: 12,
    borderRadius: radius.md,
    backgroundColor: colors.errorContainer,
  },
  section: { marginTop: 24, marginBottom: 4 },
  empty: { alignItems: 'center', marginTop: 48, gap: 8, paddingHorizontal: 24 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  center: { textAlign: 'center' },
});
