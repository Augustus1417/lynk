import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import chats from '../mock/chats.json';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chat = chats.find((c) => c.id.toString() === String(id));

  const [messages, setMessages] = useState(chat?.messages || []);
  const [input, setInput] = useState('');

  const listRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    setMessages(chat?.messages || []);
  }, [id, chat]);

  
  useEffect(() => {
    
    const t = setTimeout(() => {
      (listRef.current as any)?.scrollToEnd?.({ animated: true });
    }, 50);
    return () => clearTimeout(t);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), sender: 'You', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  if (!chat) {
    return (
      <View style={styles.center}>
        <Text>Chat not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <LinearGradient
        colors={['#D32F2F', '#C62828']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.groupAvatar}>
              <MaterialCommunityIcons
                name={chat.type === 'group' ? 'account-group' : 'account'}
                size={24}
                color="#fff"
              />
            </View>
            <View>
              <Text style={styles.header}>{chat.name}</Text>
              {chat.type === 'group' && (
                <Text style={styles.subheader}>
                  {chat.members} members • {chat.online} online
                </Text>
              )}
            </View>
          </View>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
        </View>
      </LinearGradient>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'You' ? styles.selfMessageContainer : styles.otherMessageContainer,
            ]}
          >
            {item.sender !== 'You' && (
              <View style={styles.otherAvatar}>
                <Text style={styles.avatarText}>{item.sender[0]}</Text>
              </View>
            )}

            <View
              style={[
                styles.message,
                item.sender === 'You' ? styles.selfMessage : styles.otherMessage,
              ]}
            >
              {item.sender !== 'You' && <Text style={styles.sender}>{item.sender}</Text>}
              <Text style={[styles.text, item.sender === 'You' && styles.selfText]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
          accessibilityLabel="Send message"
        >
          <LinearGradient
            colors={input.trim() ? ['#D32F2F', '#C62828'] : ['#ddd', '#ccc']}
            style={styles.sendGradient}
          >
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerGradient: { paddingVertical: 12, paddingHorizontal: 15 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  groupAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  header: { fontWeight: '700', color: '#fff', fontSize: 18 },
  subheader: { fontSize: 12, color: '#fff', opacity: 0.9, marginTop: 2 },
  messagesList: { padding: 15, paddingBottom: 5 },
  messageContainer: { flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end' },
  selfMessageContainer: { justifyContent: 'flex-end' },
  otherMessageContainer: { justifyContent: 'flex-start' },
  otherAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: { fontSize: 14, fontWeight: '600', color: '#666' },
  message: { maxWidth: '75%', padding: 12, borderRadius: 18 },
  selfMessage: { backgroundColor: '#C62828', borderBottomRightRadius: 4 },
  otherMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sender: { fontWeight: '700', color: '#C62828', fontSize: 13, marginBottom: 4 },
  text: { color: '#1a1a1a', fontSize: 15, lineHeight: 20 },
  selfText: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: { flex: 1, fontSize: 16, color: '#333', paddingHorizontal: 12, maxHeight: 100 },
  sendButton: { marginLeft: 8 },
  sendButtonDisabled: { opacity: 0.5 },
  sendGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
