import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { mockStudents, currentUserId } from '@/data/mockData';
import { Student } from '@/data/mockData';

export default function FindStudentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs = Array.from(new Set(mockStudents.map(student => student.program)));

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = !selectedProgram || student.program === selectedProgram;
    const isNotCurrentUser = student.id !== currentUserId;
    
    return matchesSearch && matchesProgram && isNotCurrentUser;
  });

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity style={[styles.studentItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={[styles.avatarText, { color: colors.secondary }]}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.studentProgram, { color: colors.textSecondary }]}>
          {item.program} • Year {item.year}
        </Text>
        <Text style={[styles.studentSection, { color: colors.textSecondary }]}>
          Section: {item.section}
        </Text>
      </View>
      <View style={styles.studentActions}>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: item.isOnline ? colors.online : colors.offline }
        ]} />
        <TouchableOpacity 
          style={[styles.messageButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/chat/${item.id}`)}
        >
          <Text style={[styles.messageButtonText, { color: colors.secondary }]}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderProgramFilter = (program: string) => (
    <TouchableOpacity
      key={program}
      style={[
        styles.programFilter,
        { 
          backgroundColor: selectedProgram === program ? colors.primary : colors.surface,
          borderColor: colors.border
        }
      ]}
      onPress={() => setSelectedProgram(selectedProgram === program ? null : program)}
    >
      <Text style={[
        styles.programFilterText,
        { color: selectedProgram === program ? colors.secondary : colors.text }
      ]}>
        {program}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Find Students</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Connect with your classmates
        </Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name or section..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <Text style={[styles.filtersTitle, { color: colors.text }]}>Filter by Program:</Text>
        <View style={styles.programFilters}>
          {programs.map(renderProgramFilter)}
        </View>
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No students found matching your criteria
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  searchInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filtersTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  programFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  programFilter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  programFilterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  studentsList: {
    flex: 1,
  },
  studentItem: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  studentProgram: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.xs,
  },
  studentSection: {
    fontSize: FontSize.sm,
  },
  studentActions: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: Spacing.sm,
  },
  messageButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  messageButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});