import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StudentCard } from './StudentCard';
import { Student } from '@/data/mockData';

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
}

export function StudentList({ students, onStudentPress }: StudentListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');

  const programs = ['All', ...Array.from(new Set(students.map(s => s.program)))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = selectedProgram === 'All' || student.program === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const renderStudent = ({ item }: { item: Student }) => (
    <StudentCard student={item} onPress={onStudentPress} />
  );

  const renderProgramFilter = (program: string) => (
    <TouchableOpacity
      key={program}
      style={[
        styles.filterChip,
        {
          backgroundColor: selectedProgram === program ? colors.primary : colors.secondary,
        }
      ]}
      onPress={() => setSelectedProgram(program)}
    >
      <ThemedText
        style={[
          styles.filterText,
          {
            color: selectedProgram === program ? 'white' : colors.text,
          }
        ]}
      >
        {program}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search students..."
          placeholderTextColor={colors.icon}
        />
      </View>

      {/* Program Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={programs}
          renderItem={({ item }) => renderProgramFilter(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {/* Students List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  studentsList: {
    flex: 1,
  },
});