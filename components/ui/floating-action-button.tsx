import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  text?: string;
}

export default function FloatingActionButton({ onPress, icon, text }: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? (
        <Text style={[styles.icon, { color: colors.secondary }]}>{icon}</Text>
      ) : (
        <Text style={[styles.text, { color: colors.secondary }]}>{text || '+'}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  icon: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  text: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
});