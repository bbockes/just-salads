import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/FavoriteButton';
import { getSaladImage } from '@/data/saladImages';
import { Radius, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Salad } from '@/types/salad';

type Props = {
  salad: Salad;
  onPress: () => void;
};

export function SaladCard({ salad, onPress }: Props) {
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(salad.id);
  const image = getSaladImage(salad.imageSlug);
  const tags = [salad.subCuisine, ...salad.flavorTags.slice(0, 1), ...salad.seasons.slice(0, 1)];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={salad.name}>
      <View style={styles.imageWrap}>
        <Image source={image} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.heart}>
          <FavoriteButton
            active={favorited}
            overlay
            onPress={() => toggleFavorite(salad.id)}
            accessibilityLabel={
              favorited
                ? `Remove ${salad.name} from favorites`
                : `Add ${salad.name} to favorites`
            }
          />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {salad.name}
        </Text>
        <View style={styles.tags}>
          {tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.tagText, { color: theme.textSecondary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: Spacing.three,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E8EFE3',
  },
  heart: {
    position: 'absolute',
    right: Spacing.two,
    bottom: Spacing.two,
  },
  body: {
    padding: Spacing.two + 2,
    gap: Spacing.one + 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  tag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
