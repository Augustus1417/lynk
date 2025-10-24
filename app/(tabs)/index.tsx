import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { mockChats, mockStudents, currentUserId } from '@/data/mockData';
import { Chat, Student } from '@/data/mockData';
import FloatingActionButton from '@/components/ui/floating-action-button';

export default function ChatsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');

  const getStudentName = (participants: string[]) => {
    const otherParticipant = participants.find(id => id !== currentUserId);
    const student = mockStudents.find(s => s.id === otherParticipant);
    return student?.name || 'Unknown';
  };

  const getStudentAvatar = (participants: string[]) => {
    const otherParticipant = participants.find(id => id !== currentUserId);
    const student = mockStudents.find(s => s.id === otherParticipant);
    return student?.name.split(' ').map(n => n[0]).join('') || '?';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={[styles.chatItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        if (item.isGroup) {
          // Navigate to group chat
          router.push(`/group-chat/${item.id}`);
        } else {
          // Navigate to direct chat
          const otherParticipant = item.participants.find(id => id !== currentUserId);
          router.push(`/chat/${otherParticipant}`);
        }
      }}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={[styles.avatarText, { color: colors.secondary }]}>
          {item.isGroup ? 'G' : getStudentAvatar(item.participants)}
        </Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: colors.text }]}>{item.name}</Text>
          {item.lastMessage && (
            <Text style={[styles.chatTime, { color: colors.textSecondary }]}>
              {formatTime(item.lastMessage.timestamp)}
            </Text>
          )}
        </View>
        <View style={styles.chatPreview}>
          <Text 
            style={[
              styles.lastMessage, 
              { color: colors.textSecondary },
              !item.lastMessage?.isRead && { color: colors.text, fontWeight: FontWeight.medium }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage?.content || 'No messages yet'}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.unreadText, { color: colors.secondary }]}>
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Lynk</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>College Chat</Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search chats..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
      
      <FloatingActionButton
        onPress={() => router.push('/(tabs)/explore')}
        icon="+"
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
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
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  chatName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
  },
  chatTime: {
    fontSize: FontSize.sm,
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  unreadText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});