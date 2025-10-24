import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { mockStudents, mockMessages, currentUserId } from '@/data/mockData';
import { Message, Student } from '@/data/mockData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const flatListRef = useRef<FlatList>(null);

  // Get chat participants
  const participants = mockStudents.filter(student => 
    student.id === currentUserId || student.id === id
  );
  const otherParticipant = participants.find(p => p.id !== currentUserId);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false,
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === currentUserId;
    const sender = mockStudents.find(s => s.id === item.senderId);
    
    return (
      <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
        <View style={[
          styles.messageBubble,
          { 
            backgroundColor: isOwn ? colors.chatBubbleOwn : colors.chatBubble,
            borderColor: colors.border
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isOwn ? colors.chatBubbleTextOwn : colors.chatBubbleText }
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isOwn ? colors.chatBubbleTextOwn : colors.textSecondary }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={[styles.headerAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.headerAvatarText, { color: colors.secondary }]}>
              {otherParticipant?.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={[styles.headerName, { color: colors.text }]}>
              {otherParticipant?.name}
            </Text>
            <Text style={[styles.headerStatus, { color: colors.textSecondary }]}>
              {otherParticipant?.isOnline ? 'Online' : `Last seen ${otherParticipant?.lastSeen}`}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { backgroundColor: messageText.trim() ? colors.primary : colors.textLight }
              ]}
              onPress={sendMessage}
              disabled={!messageText.trim()}
            >
              <Text style={[styles.sendButtonText, { color: colors.secondary }]}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerAvatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  headerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  headerStatus: {
    fontSize: FontSize.sm,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: Spacing.md,
  },
  messageContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  messageText: {
    fontSize: FontSize.md,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  messageTime: {
    fontSize: FontSize.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.md,
    maxHeight: 100,
    paddingVertical: Spacing.xs,
  },
  sendButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing.sm,
  },
  sendButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});