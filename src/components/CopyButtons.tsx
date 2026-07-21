import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Salad } from '@/types/salad';
import { formatIngredientsClipboard, formatRecipeClipboard } from '@/utils/formatClipboard';

type Props = {
  salad: Salad;
  /** When provided (e.g. scaled), used instead of salad.ingredients for copy */
  ingredientLines?: string[];
};

export function CopyButtons({ salad, ingredientLines }: Props) {
  const theme = useTheme();
  const [copied, setCopied] = useState<'ingredients' | 'recipe' | null>(null);
  const lines = ingredientLines ?? salad.ingredients;

  async function copy(kind: 'ingredients' | 'recipe') {
    const text =
      kind === 'ingredients'
        ? formatIngredientsClipboard(salad, lines)
        : formatRecipeClipboard(salad, lines);
    await Clipboard.setStringAsync(text);
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => copy('ingredients')}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.primary,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Copy ingredients">
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          {copied === 'ingredients' ? 'Copied!' : 'Copy Ingredients'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => copy('recipe')}
        style={({ pressed }) => [
          styles.button,
          styles.secondary,
          {
            borderColor: theme.primary,
            backgroundColor: theme.card,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Copy recipe">
        <Text style={[styles.buttonText, { color: theme.primary }]}>
          {copied === 'recipe' ? 'Copied!' : 'Copy Recipe'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  button: {
    minHeight: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  secondary: {
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
