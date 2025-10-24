import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StudentList } from '@/components/student/StudentList';
import { mockStudents } from '@/data/mockData';
import { Student } from '@/data/mockData';

export default function FindStudentsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleStudentPress = (student: Student) => {
    // In a real app, this would navigate to a profile or start a chat
    console.log('Selected student:', student.name);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Find Students
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
          Connect with your classmates
        </ThemedText>
      </View>
      <StudentList students={mockStudents} onStudentPress={handleStudentPress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
});