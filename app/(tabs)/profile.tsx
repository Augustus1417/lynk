import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface User {
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

export default function ProfileScreen() {
  // Mock user data
  const user: User = {
    name: 'Jed Cruz',
    email: '2023-2-03175@lpunetwork.edu.ph',
    avatar: '',
    bio: 'I use Arch, btw',
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#D32F2F', '#C62828', '#B71C1C']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.bioContainer}>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="account-edit-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E53935' }]}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  headerGradient: { paddingVertical: 40, alignItems: 'center' },
  headerContent: { alignItems: 'center' },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  email: { fontSize: 14, color: '#fff', opacity: 0.9 },
  bioContainer: { paddingVertical: 15, backgroundColor: '#fff', marginBottom: 10 },
  bio: { fontSize: 14, color: '#777', textAlign: 'center', paddingHorizontal: 20 },
  section: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#C62828', marginBottom: 10 },
  courseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  courseText: { marginLeft: 8, fontSize: 14, color: '#333' },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C62828',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: { color: '#fff', fontWeight: '600', marginLeft: 10, fontSize: 14 },
});
