import { StyleSheet, View } from 'react-native';
import Icon from './Icon';
import { colors } from '../theme';

export default function BrandMark({ size = 36 }) {
  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.3 }]}>
      <Icon name="traffic-light" size={size * 0.58} color={colors.onPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
