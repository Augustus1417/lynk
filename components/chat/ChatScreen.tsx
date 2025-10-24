import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MessageBubble } from './MessageBubble';
import { Chat, Message, currentUser } from '@/data/mockData';

interface ChatScreenProps {
  chat: Chat;
  onBack: () => void;
}

export function ChatScreen({ chat, onBack }: ChatScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isCurrentUser={item.senderId === currentUser.id}
    />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={[styles.backText, { color: colors.primary }]}>
            ← Back
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: colors.text }]}>
          {chat.name}
        </ThemedText>
        <View style={styles.placeholder} />
      </ThemedView>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Message Input */}
      <ThemedView style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.secondary,
              color: colors.text,
              borderColor: colors.border,
            }
          ]}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={colors.icon}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSendMessage}
        >
          <ThemedText style={styles.sendButtonText}>Send</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholder: {
    width: 50,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});