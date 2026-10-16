import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { causeIcon, causeLabel, gravite } from '../constants';
import { formatDistance, ilYa } from '../format';
import { colors, elevation, radius } from '../theme';

export default function ReportCard({ report, distance, isMine }) {
  const g = gravite(report.gravite);
  return (
    <View style={styles.card}>
      <View style={[styles.leading, { backgroundColor: g.container }]}>
        <Icon name={causeIcon(report.cause)} size={24} color={g.color} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText variant="title" numberOfLines={1} style={styles.title}>
            {report.lieu}
          </AppText>
          <View style={[styles.status, { backgroundColor: g.container }]}>
            <View style={[styles.dot, { backgroundColor: g.color }]} />
            <AppText variant="labelSmall" color={g.color}>
              {g.label}
            </AppText>
          </View>
        </View>

        <AppText variant="body" color={colors.onSurfaceVariant}>
          {causeLabel(report)}
        </AppText>

        <View style={styles.meta}>
          <Icon name="clock-outline" size={14} color={colors.outline} />
          <AppText variant="bodySmall" color={colors.onSurfaceVariant}>
            {ilYa(report.createdAt)}
          </AppText>
          <AppText variant="bodySmall" color={colors.outlineVariant}>
            •
          </AppText>
          <AppText variant="bodySmall" color={colors.onSurfaceVariant} numberOfLines={1} style={styles.author}>
            {isMine ? 'Vous' : report.auteur.name}
          </AppText>
          {distance != null && (
            <>
              <AppText variant="bodySmall" color={colors.outlineVariant}>
                •
              </AppText>
              <Icon name="map-marker-outline" size={14} color={colors.outline} />
              <AppText variant="bodySmall" color={colors.onSurfaceVariant}>
                {formatDistance(distance)}
              </AppText>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    marginBottom: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...elevation.card,
  },
  leading: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  author: { flexShrink: 1 },
});
