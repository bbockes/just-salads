/**
 * Just Salads theme — clean, minimal, quirky with a leafy accent.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A2E1F',
    textSecondary: '#5C6B60',
    background: '#F7F9F4',
    backgroundElement: '#E8EFE3',
    backgroundSelected: '#D4E4C8',
    primary: '#2F6B3A',
    primaryMuted: '#4A8B55',
    accent: '#E8A838',
    card: '#FFFFFF',
    border: '#D5DED0',
    chip: '#E8EFE3',
    chipActive: '#2F6B3A',
    chipActiveText: '#FFFFFF',
    danger: '#B33A3A',
  },
  dark: {
    text: '#F0F5ED',
    textSecondary: '#A8B5AB',
    background: '#121A14',
    backgroundElement: '#1C281F',
    backgroundSelected: '#2A3A2E',
    primary: '#6FBF7A',
    primaryMuted: '#4A8B55',
    accent: '#E8A838',
    card: '#1C281F',
    border: '#2E3D32',
    chip: '#1C281F',
    chipActive: '#6FBF7A',
    chipActiveText: '#121A14',
    danger: '#E07070',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'system-ui',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const MaxContentWidth = 800;
