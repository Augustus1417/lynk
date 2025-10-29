import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatBubble from "../../components/ChatBubble";
import InputBox from "../../components/InputBox";
import { useAuth } from "../../contexts/AuthContext";
import { addMessage, getChatById, subscribeToMessages } from "../../services/chatService";
import { getUserById } from "../../services/userService";
import { Message } from "../../types/message";

export default function ChatRoom({ route, navigation }: any) {
  const { chatId, chatName } = route.params;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  // Fetch chat members and map UID -> Name
  useEffect(() => {
    const fetchMembers = async () => {
      const chat = await getChatById(chatId);
      if (!chat) return;

      const map: Record<string, string> = {};
      for (const uid of chat.members) {
        const u = await getUserById(uid);
        if (u) map[uid] = `${u.firstName} ${u.lastName}`;
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

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    await addMessage(chatId, {
      text: newMessage.trim(),
      senderId: user.uid,
    });

    setNewMessage("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{chatName || "Chat"}</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("ChatSettings", { chatId, chatName })}
          >
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isMe={item.senderId === user?.uid}
              senderName={usersMap[item.senderId] || "Unknown"}
            />
          )}
          contentContainerStyle={{ padding: 12, paddingBottom: 12 }}
          style={styles.messagesList}
        />

        {/* Input */}
        <InputBox value={newMessage} onChangeText={setNewMessage} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  messagesList: { flex: 1 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", flex: 1 },
  settingsButton: { marginLeft: 12 },
});
