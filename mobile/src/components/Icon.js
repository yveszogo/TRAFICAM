import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function Icon({ name, size = 22, color = colors.onSurfaceVariant, style }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
