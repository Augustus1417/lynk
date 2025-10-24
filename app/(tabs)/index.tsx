import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ChatList } from '@/components/chat/ChatList';
import { ChatScreen } from '@/components/chat/ChatScreen';
import { mockChats } from '@/data/mockData';
import { Chat } from '@/data/mockData';

export default function ChatsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleChatPress = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  if (selectedChat) {
    return <ChatScreen chat={selectedChat} onBack={handleBack} />;
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Messages
        </ThemedText>
        <TouchableOpacity style={[styles.newChatButton, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.newChatText}>+</ThemedText>
        </TouchableOpacity>
      </View>
      <ChatList chats={mockChats} onChatPress={handleChatPress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
