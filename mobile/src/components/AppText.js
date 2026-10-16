import { Text } from 'react-native';
import { colors, type } from '../theme';

// Texte de l'application : applique la police Inter et l'échelle typographique.
export default function AppText({ variant = 'body', color = colors.onSurface, style, ...props }) {
  return <Text {...props} style={[type[variant], { color }, style]} />;
}
