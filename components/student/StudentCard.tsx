import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Student } from '@/data/mockData';

interface StudentCardProps {
  student: Student;
  onPress: (student: Student) => void;
}

export function StudentCard({ student, onPress }: StudentCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={() => onPress(student)}
    >
      <View style={styles.content}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <ThemedText style={[styles.avatarText, { color: 'white' }]}>
            {student.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.info}>
          <ThemedText style={[styles.name, { color: colors.text }]}>
            {student.name}
          </ThemedText>
          <ThemedText style={[styles.program, { color: colors.icon }]}>
            {student.program} • Year {student.year}
          </ThemedText>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: student.isOnline ? '#10B981' : colors.icon }
              ]}
            />
            <ThemedText style={[styles.status, { color: colors.icon }]}>
              {student.isOnline ? 'Online' : student.lastSeen}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  program: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
  },
});