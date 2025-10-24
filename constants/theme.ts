export const Colors = {
  light: {
    primary: '#DC2626', // Red-600
    primaryDark: '#B91C1C', // Red-700
    primaryLight: '#FEE2E2', // Red-100
    secondary: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#F9FAFB', // Gray-50
    text: '#111827', // Gray-900
    textSecondary: '#6B7280', // Gray-500
    textLight: '#9CA3AF', // Gray-400
    border: '#E5E7EB', // Gray-200
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    error: '#EF4444', // Red-500
    chatBubble: '#FFFFFF',
    chatBubbleOwn: '#DC2626',
    chatBubbleText: '#111827',
    chatBubbleTextOwn: '#FFFFFF',
    online: '#10B981',
    offline: '#9CA3AF',
  },
  dark: {
    primary: '#DC2626', // Red-600
    primaryDark: '#B91C1C', // Red-700
    primaryLight: '#7F1D1D', // Red-900
    secondary: '#1F2937', // Gray-800
    background: '#111827', // Gray-900
    surface: '#1F2937', // Gray-800
    text: '#F9FAFB', // Gray-50
    textSecondary: '#D1D5DB', // Gray-300
    textLight: '#9CA3AF', // Gray-400
    border: '#374151', // Gray-700
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    error: '#EF4444', // Red-500
    chatBubble: '#374151', // Gray-700
    chatBubbleOwn: '#DC2626',
    chatBubbleText: '#F9FAFB',
    chatBubbleTextOwn: '#FFFFFF',
    online: '#10B981',
    offline: '#6B7280',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};