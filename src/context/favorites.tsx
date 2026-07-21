import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';

const STORAGE_KEY = '@just-salads/favorites';

type FavoritesContextValue = {
  favoriteIds: number[];
  ready: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

async function loadFavoriteIds(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === 'number');
  } catch {
    return [];
  }
}

async function saveFavoriteIds(ids: number[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadFavoriteIds().then((ids) => {
      if (!cancelled) {
        setFavoriteIds(ids);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      void saveFavoriteIds(next);
      return next;
    });
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, ready, isFavorite, toggleFavorite }),
    [favoriteIds, ready, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}
