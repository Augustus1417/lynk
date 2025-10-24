import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import studentsData from '../mock/students.json';
import { Student } from '../types/Student';

export default function FindStudents() {
  const [query, setQuery] = useState('');
  const students: Student[] = studentsData;
  const filtered = students.filter((s) =>
    s.program.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D32F2F', '#C62828']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.header}>Find Students by Program</Text>
        <Text style={styles.subheader}>
          Discover classmates in your program
        </Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by program"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        {query.length > 0 && (
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color="#999"
            style={styles.clearIcon}
            onPress={() => setQuery('')}
          />
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#D32F2F', '#C62828']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {(() => {
                    const parts = item.name.trim().split(' ');
                    if (parts.length === 1) return parts[0][0].toUpperCase();
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  })()}
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="school" size={16} color="#666" />
                <Text style={styles.info}>{item.program}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="google-classroom" size={16} color="#666" />
                <Text style={styles.info}>Section {item.section}</Text>
              </View>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#C62828"
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search" size={64} color="#ddd" />
            <Text style={styles.emptyText}>
              {query ? 'No students found' : 'Start searching for students'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 25,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  subheader: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 15,
    marginTop: -15,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    padding: 5,
  },
  listContent: {
    padding: 15,
    paddingTop: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: 17,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  info: {
    color: '#666',
    fontSize: 14,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
  },
});