import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterBar } from '@/components/FilterBar';
import { SaladCard } from '@/components/SaladCard';
import { SALADS } from '@/data/salads';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { SaladFilters } from '@/types/salad';
import { filterSalads } from '@/utils/filterSalads';

const EMPTY_FILTERS: SaladFilters = {
  query: '',
  cuisine: null,
  flavor: null,
  season: null,
};

export default function RecipeListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<SaladFilters>(EMPTY_FILTERS);

  const filtered = useMemo(() => filterSalads(SALADS, filters), [filters]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Pinned above the list so search/filters stay reachable */}
      <View style={[styles.toolbar, { borderBottomColor: theme.border }]}>
        <FilterBar filters={filters} onChange={setFilters} />
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {filtered.length} of {SALADS.length} salads
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.four },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No salads match</Text>
            <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
              Try a different search or clear a filter.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={[styles.cardWrap, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
            <SaladCard
              salad={item}
              onPress={() =>
                router.push({
                  pathname: '/recipe/[id]',
                  params: { id: String(item.id) },
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: Spacing.three,
  },
  listContent: {
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.three,
    flexGrow: 1,
  },
  row: {
    gap: Spacing.two,
    justifyContent: 'flex-start',
  },
  cardWrap: {
    // Cap at half width so an odd last card doesn't stretch full-bleed
    width: '48%',
    flexGrow: 0,
  },
  cardLeft: {
    paddingLeft: Spacing.one,
  },
  cardRight: {
    paddingRight: Spacing.one,
  },
  empty: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
