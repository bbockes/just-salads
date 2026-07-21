import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  active: boolean;
  onPress: () => void;
  /** Light circle behind the icon (for image overlays) */
  overlay?: boolean;
  accessibilityLabel?: string;
};

export function FavoriteButton({ active, onPress, overlay, accessibilityLabel }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.hit,
        overlay && styles.overlay,
        overlay && { backgroundColor: 'rgba(255,255,255,0.92)' },
        { opacity: pressed ? 0.75 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (active ? 'Remove from favorites' : 'Add to favorites')
      }
      accessibilityState={{ selected: active }}>
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={22}
        color={active ? theme.primary : theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    borderRadius: 22,
  },
});
