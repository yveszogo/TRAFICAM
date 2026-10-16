// Design system Traficam — inspiré de Material Design 3 (Google).
// Toutes les couleurs, polices et tailles de l'application sont définies ici.

export const colors = {
  primary: '#0B57D0',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D3E3FD',
  onPrimaryContainer: '#041E49',

  secondaryContainer: '#C2E7FF',
  onSecondaryContainer: '#001D35',

  background: '#F8FAFD',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F3F6FC',
  surfaceContainer: '#EEF2F9',
  surfaceContainerHigh: '#E3E8F0',

  onSurface: '#1F1F1F',
  onSurfaceVariant: '#444746',
  outline: '#747775',
  outlineVariant: '#C4C7C5',

  error: '#B3261E',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',

  success: '#146C2E',
  successContainer: '#C4EED0',

  inverseSurface: '#303030',
  inverseOnSurface: '#F2F2F2',

  // Niveaux de trafic
  slow: '#B06000',
  slowContainer: '#FEEFC3',
  blocked: '#C5221F',
  blockedContainer: '#FCE8E6',
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Échelle typographique (Material 3, adaptée à Inter).
export const type = {
  headline: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 32, letterSpacing: -0.3 },
  titleLarge: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28, letterSpacing: -0.2 },
  title: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
  titleSmall: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  labelSmall: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
  overline: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 28, full: 999 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const elevation = {
  card: {
    shadowColor: '#0B1D3A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  raised: {
    shadowColor: '#0B1D3A',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};
