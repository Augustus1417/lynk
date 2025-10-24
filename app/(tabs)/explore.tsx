import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockClassSections } from '@/data/mockData';
import { ClassSection } from '@/data/mockData';

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleGroupPress = (group: ClassSection) => {
    // In a real app, this would navigate to the group chat
    console.log('Selected group:', group.courseName);
  };

  const renderGroup = ({ item }: { item: ClassSection }) => (
    <TouchableOpacity
      style={[styles.groupCard, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={() => handleGroupPress(item)}
    >
      <View style={styles.groupContent}>
        <View style={[styles.groupIcon, { backgroundColor: colors.primary }]}>
          <ThemedText style={[styles.groupIconText, { color: 'white' }]}>
            {item.courseCode.charAt(0)}
          </ThemedText>
        </View>
        <View style={styles.groupInfo}>
          <ThemedText style={[styles.courseName, { color: colors.text }]}>
            {item.courseName}
          </ThemedText>
          <ThemedText style={[styles.courseCode, { color: colors.icon }]}>
            {item.courseCode} - Section {item.section}
          </ThemedText>
          <ThemedText style={[styles.professor, { color: colors.icon }]}>
            Prof. {item.professor}
          </ThemedText>
          <ThemedText style={[styles.studentCount, { color: colors.icon }]}>
            {item.students.length} students
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Class Groups
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
          Join your class group chats
        </ThemedText>
      </View>
      <FlatList
        data={mockClassSections}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        style={styles.groupsList}
        showsVerticalScrollIndicator={false}
      />
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
  groupsList: {
    flex: 1,
  },
  groupCard: {
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
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    marginBottom: 2,
  },
  professor: {
    fontSize: 14,
    marginBottom: 2,
  },
  studentCount: {
    fontSize: 12,
  },
});