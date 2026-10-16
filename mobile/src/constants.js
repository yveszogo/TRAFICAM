import { colors } from './theme';

// Doit rester aligné avec backend/src/constants.js.
// "icon" = nom d'icône MaterialCommunityIcons (https://icons.expo.fyi).

export const CAUSES = [
  { value: 'accident', label: 'Accident', icon: 'car-emergency' },
  { value: 'travaux', label: 'Travaux', icon: 'traffic-cone' },
  { value: 'marche', label: 'Marché', icon: 'store-outline' },
  { value: 'pluie_inondation', label: 'Pluie / inondation', icon: 'weather-pouring' },
  { value: 'panne', label: 'Véhicule en panne', icon: 'car-wrench' },
  { value: 'controle_police', label: 'Contrôle de police', icon: 'police-badge-outline' },
  { value: 'route_barree', label: 'Route barrée', icon: 'sign-direction-remove' },
  { value: 'heure_de_pointe', label: 'Heure de pointe', icon: 'clock-alert-outline' },
  { value: 'autre', label: 'Autre', icon: 'dots-horizontal' },
];

export const GRAVITES = [
  {
    value: 'un_peu_fluide',
    label: 'Ralenti',
    description: 'Ça circule un peu, on avance lentement',
    icon: 'speedometer-slow',
    color: colors.slow,
    container: colors.slowContainer,
  },
  {
    value: 'bloque',
    label: 'Bloqué',
    description: 'Ça ne circule pas du tout',
    icon: 'car-off',
    color: colors.blocked,
    container: colors.blockedContainer,
  },
];

export function causeLabel(report) {
  if (report.cause === 'autre' && report.causeAutre) return report.causeAutre;
  return CAUSES.find((c) => c.value === report.cause)?.label ?? report.cause;
}

export function causeIcon(cause) {
  return CAUSES.find((c) => c.value === cause)?.icon ?? 'car-multiple';
}

export function gravite(value) {
  return GRAVITES.find((g) => g.value === value) ?? GRAVITES[0];
}
