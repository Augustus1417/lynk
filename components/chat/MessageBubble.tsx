import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Message } from '@/data/mockData';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.messageContainer,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <ThemedView
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          {
            backgroundColor: isCurrentUser ? colors.primary : colors.secondary,
          }
        ]}
      >
        <ThemedText
          style={[
            styles.messageText,
            {
              color: isCurrentUser ? 'white' : colors.text,
            }
          ]}
        >
          {message.content}
        </ThemedText>
        <ThemedText
          style={[
            styles.timestamp,
            {
              color: isCurrentUser ? 'rgba(255,255,255,0.7)' : colors.icon,
            }
          ]}
        >
          {formatTime(message.timestamp)}
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});