import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CopyButtons } from '@/components/CopyButtons';
import { FavoriteButton } from '@/components/FavoriteButton';
import { getSaladById } from '@/data/salads';
import { getSaladImage } from '@/data/saladImages';
import { Radius, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import {
  expandIngredientsForDisplay,
  formatScaledIngredientsClipboard,
} from '@/utils/formatDressing';
import {
  ingredientHighlightTerms,
  segmentStepByIngredients,
} from '@/utils/highlightIngredients';
import type { UnitMode } from '@/utils/metricUnits';

const SCALE_OPTIONS = [1, 2, 3, 4, 5, 6, 8] as const;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const salad = getSaladById(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [scale, setScale] = useState(1);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [unitMode, setUnitMode] = useState<UnitMode>('metric');

  const favorited = salad ? isFavorite(salad.id) : false;

  const ingredientRows = useMemo(
    () => (salad ? expandIngredientsForDisplay(salad.ingredients, scale, unitMode) : []),
    [salad, scale, unitMode]
  );

  const clipboardIngredients = useMemo(
    () => (salad ? formatScaledIngredientsClipboard(salad.ingredients, scale, unitMode) : []),
    [salad, scale, unitMode]
  );

  const highlightTerms = useMemo(
    () => (salad ? ingredientHighlightTerms(salad.ingredients) : []),
    [salad]
  );

  if (!salad) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={[styles.missing, { color: theme.text }]}>Salad not found</Text>
      </View>
    );
  }

  const image = getSaladImage(salad.imageSlug);
  const tags = [salad.subCuisine, ...salad.flavorTags, ...salad.seasons];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: salad.name,
          headerRight: () => (
            <FavoriteButton
              active={favorited}
              onPress={() => toggleFavorite(salad.id)}
              accessibilityLabel={
                favorited ? 'Remove from favorites' : 'Add to favorites'
              }
            />
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.five },
        ]}
        showsVerticalScrollIndicator={false}>
        <Image source={image} style={styles.hero} contentFit="cover" transition={200} />

        <View style={styles.body}>
          <Text style={[styles.title, { color: theme.text }]}>{salad.name}</Text>

          <View style={styles.tags}>
            {tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
              </View>
            ))}
          </View>

          <CopyButtons salad={salad} ingredientLines={clipboardIngredients} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients</Text>
              <View style={styles.headerActions}>
                <Pressable
                  onPress={() =>
                    setUnitMode((m) => (m === 'imperial' ? 'metric' : 'imperial'))
                  }
                  style={({ pressed }) => [
                    styles.unitPill,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.primary,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Units ${unitMode}. Tap to switch.`}>
                  <Text style={[styles.unitPillText, { color: theme.primary }]}>
                    {unitMode === 'imperial' ? 'US' : 'Metric'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setScaleOpen(true)}
                  style={({ pressed }) => [
                    styles.scalePill,
                    {
                      backgroundColor: theme.primary,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Scale recipe, currently times ${scale}`}>
                  <Text style={styles.scalePillText}>Scale: × {scale}</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.listCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {ingredientRows.map((row, index) => {
                const isLast = index === ingredientRows.length - 1;
                if (row.kind === 'dressingHeader') {
                  return (
                    <View
                      key={`row-${index}`}
                      style={[
                        styles.ingredientRow,
                        styles.dressingHeaderRow,
                        { backgroundColor: theme.backgroundElement },
                        !isLast && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: theme.border,
                        },
                      ]}>
                      <Text style={[styles.dressingHeaderLabel, { color: theme.primary }]}>
                        Dressing
                      </Text>
                      <Text style={[styles.dressingHeaderTitle, { color: theme.text }]}>
                        {row.title}
                      </Text>
                    </View>
                  );
                }

                if (row.kind === 'diyLabel') {
                  return (
                    <View
                      key={`row-${index}`}
                      style={[
                        styles.ingredientRow,
                        !isLast && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: theme.border,
                        },
                      ]}>
                      <Text style={[styles.diyLabel, { color: theme.textSecondary }]}>Make it</Text>
                    </View>
                  );
                }

                return (
                  <View
                    key={`row-${index}`}
                    style={[
                      styles.ingredientRow,
                      !isLast && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.border,
                      },
                    ]}>
                    {row.amount ? (
                      <Text style={styles.ingredientText}>
                        <Text style={{ color: theme.primary, fontWeight: '700' }}>{row.amount}</Text>
                        <Text style={{ color: theme.text }}> {row.rest}</Text>
                      </Text>
                    ) : (
                      <Text style={[styles.ingredientText, { color: theme.text }]}>{row.rest}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Instructions</Text>
            <View style={[styles.listCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {salad.steps.map((step, index) => {
                const isLast = index === salad.steps.length - 1;
                const segments = segmentStepByIngredients(step, highlightTerms);
                return (
                  <View
                    key={`step-${index}`}
                    style={[
                      styles.ingredientRow,
                      !isLast && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.border,
                      },
                    ]}>
                    <Text style={[styles.ingredientText, { color: theme.text }]}>
                      <Text style={{ color: theme.primary, fontWeight: '800' }}>{index + 1}. </Text>
                      {segments.map((seg, i) =>
                        seg.highlight ? (
                          <Text
                            key={`${index}-${i}`}
                            style={{ color: theme.primary, fontWeight: '700' }}>
                            {seg.text}
                          </Text>
                        ) : (
                          <Text key={`${index}-${i}`}>{seg.text}</Text>
                        )
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={scaleOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setScaleOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setScaleOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.card }]}
            onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Scale recipe</Text>
              <Pressable onPress={() => setScaleOpen(false)} hitSlop={12}>
                <Text style={[styles.done, { color: theme.primary }]}>Done</Text>
              </Pressable>
            </View>
            <Text style={[styles.sheetHint, { color: theme.textSecondary }]}>
              Multiplies ingredient amounts. Base recipe is × 1.
            </Text>
            <FlatList
              data={[...SCALE_OPTIONS]}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => {
                const selected = item === scale;
                return (
                  <Pressable
                    onPress={() => {
                      setScale(item);
                      setScaleOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        backgroundColor: selected
                          ? theme.backgroundSelected
                          : pressed
                            ? theme.backgroundElement
                            : 'transparent',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.text, fontWeight: selected ? '800' : '500' },
                      ]}>
                      × {item}
                    </Text>
                    {selected ? (
                      <Text style={{ color: theme.primary, fontWeight: '800' }}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    gap: 0,
  },
  hero: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E8EFE3',
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
  },
  tag: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  unitPill: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  unitPillText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scalePill: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scalePillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  listCard: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  ingredientRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  dressingHeaderRow: {
    gap: Spacing.half,
  },
  dressingHeaderLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dressingHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  diyLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  ingredientText: {
    fontSize: 15,
    lineHeight: 22,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '50%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: Spacing.five,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.one,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetHint: {
    fontSize: 13,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  done: {
    fontSize: 16,
    fontWeight: '700',
  },
  option: {
    minHeight: 52,
    marginHorizontal: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 17,
  },
});
