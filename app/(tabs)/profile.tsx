import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { mockStudents, currentUserId } from '@/data/mockData';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const currentUser = mockStudents.find(student => student.id === currentUserId);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.secondary }]}>
              {currentUser?.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{currentUser?.name}</Text>
          <Text style={[styles.program, { color: colors.textSecondary }]}>
            {currentUser?.program} • Year {currentUser?.year}
          </Text>
          <Text style={[styles.section, { color: colors.textSecondary }]}>
            Section: {currentUser?.section}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Edit Profile</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Lynk</Text>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Version</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingText, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]}>
          <Text style={[styles.logoutText, { color: colors.secondary }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  program: {
    fontSize: FontSize.md,
    marginBottom: Spacing.xs,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: FontSize.md,
  },
  settingValue: {
    fontSize: FontSize.md,
  },
  settingArrow: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});