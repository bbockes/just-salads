import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FLAVORS, SEASONS, SUB_CUISINES } from '@/data/filterOptions';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Flavor, SaladFilters, Season, SubCuisine } from '@/types/salad';

type Props = {
  filters: SaladFilters;
  onChange: (next: SaladFilters) => void;
};

type PickerKind = 'cuisine' | 'flavor' | 'season' | null;

export function FilterBar({ filters, onChange }: Props) {
  const theme = useTheme();
  const [picker, setPicker] = useState<PickerKind>(null);

  const pickerConfig = useMemo(() => {
    if (picker === 'cuisine') {
      return {
        title: 'Cuisine',
        options: SUB_CUISINES as readonly string[],
        value: filters.cuisine,
        onSelect: (value: string | null) =>
          onChange({ ...filters, cuisine: value as SubCuisine | null }),
      };
    }
    if (picker === 'flavor') {
      return {
        title: 'Flavor',
        options: FLAVORS as readonly string[],
        value: filters.flavor,
        onSelect: (value: string | null) =>
          onChange({ ...filters, flavor: value as Flavor | null }),
      };
    }
    if (picker === 'season') {
      return {
        title: 'Season',
        options: SEASONS as readonly string[],
        value: filters.season,
        onSelect: (value: string | null) =>
          onChange({ ...filters, season: value as Season | null }),
      };
    }
    return null;
  }, [filters, onChange, picker]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.search,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}>
        <Ionicons name="search" size={18} color={theme.textSecondary} />
        <TextInput
          value={filters.query}
          onChangeText={(query) => onChange({ ...filters, query })}
          placeholder="Search salads"
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>

      <View style={styles.pills}>
        <FilterPill
          label={filters.cuisine ?? 'Cuisine'}
          active={!!filters.cuisine}
          onPress={() => setPicker('cuisine')}
          chevron
        />
        <FilterPill
          label={filters.flavor ?? 'Flavor'}
          active={!!filters.flavor}
          onPress={() => setPicker('flavor')}
          chevron
        />
        <FilterPill
          label={filters.season ?? 'Season'}
          active={!!filters.season}
          onPress={() => setPicker('season')}
          chevron
        />
      </View>

      <Modal
        visible={picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPicker(null)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.card }]}
            onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                {pickerConfig?.title}
              </Text>
              <Pressable
                onPress={() => setPicker(null)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Text style={[styles.close, { color: theme.primary }]}>Done</Text>
              </Pressable>
            </View>

            <FlatList
              data={['All', ...(pickerConfig?.options ?? [])]}
              keyExtractor={(item) => item}
              style={styles.optionList}
              renderItem={({ item }) => {
                const isAll = item === 'All';
                const selected = isAll
                  ? pickerConfig?.value == null
                  : pickerConfig?.value === item;
                return (
                  <Pressable
                    onPress={() => {
                      pickerConfig?.onSelect(isAll ? null : item);
                      setPicker(null);
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
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: !!selected }}>
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: theme.text,
                          fontWeight: selected ? '700' : '500',
                        },
                      ]}>
                      {item}
                    </Text>
                    {selected ? (
                      <Ionicons name="checkmark" size={20} color={theme.primary} />
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

function FilterPill({
  label,
  active,
  chevron,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  active: boolean;
  chevron?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const fg = active ? theme.chipActiveText : theme.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: active ? theme.chipActive : theme.backgroundElement,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active }}>
      <Text style={[styles.pillText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
      {chevron ? <Ionicons name="chevron-down" size={14} color={fg} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  search: {
    marginHorizontal: Spacing.three,
    minHeight: 48,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
  pills: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '55%',
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
    paddingBottom: Spacing.two,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  close: {
    fontSize: 16,
    fontWeight: '700',
  },
  optionList: {
    paddingHorizontal: Spacing.two,
  },
  option: {
    minHeight: 52,
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
