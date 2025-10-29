import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatBubble from "../../components/ChatBubble";
import InputBox from "../../components/InputBox";
import { useAuth } from "../../contexts/AuthContext";
import { addMessage, getChatById, subscribeToMessages } from "../../services/chatService";
import { getUserById } from "../../services/userService";
import { Message } from "../../types/message";
import { User } from "../../types/user";

export default function ChatRoom({ route, navigation }: any) {
  const { chatId, chatName } = route.params;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const listRef = useRef<FlatList<Message>>(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: chatName || "Chat",
      headerRight: () => (
        <Ionicons
          name="settings-outline"
          size={22}
          style={{ marginRight: 12 }}
          onPress={() => navigation.navigate("ChatSettings", { chatId, chatName })}
        />
      ),
    });
  }, [navigation, chatName]);

  // Fetch chat members and map UID -> Name
  useEffect(() => {
    const fetchMembers = async () => {
      const chat = await getChatById(chatId);
      if (!chat) return;

      const map: Record<string, User> = {};
      for (const uid of chat.members) {
        const u = await getUserById(uid);
        if (u) map[uid] = u;
      }
      setUsersMap(map);
    };
    fetchMembers();
  }, [chatId]);

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, setMessages);
    return () => unsubscribe();
  }, [chatId]);

  // Auto-scroll to latest when messages change
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    const text = newMessage.trim();
    setNewMessage("");
    await addMessage(chatId, {
      text,
      senderId: user.uid,
    });
  };

  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isMe={item.senderId === user?.uid}
              senderName={usersMap[item.senderId] ? `${usersMap[item.senderId].firstName} ${usersMap[item.senderId].lastName}` : "Unknown"}
              avatarUrl={usersMap[item.senderId]?.profilePicture}
            />
          )}
          contentContainerStyle={{ padding: 12, paddingBottom: 12 }}
          style={styles.messagesList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          keyboardShouldPersistTaps="handled"
        />

        <InputBox value={newMessage} onChangeText={setNewMessage} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  messagesList: { flex: 1 },
});
