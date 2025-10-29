import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserListItem from "../../components/UserListItem";
import { useAuth } from "../../contexts/AuthContext";
import { getChatById, updateChatMembers } from "../../services/chatService";
import { getUserById } from "../../services/userService";
import { User } from "../../types/user";

export default function ChatSettings({ route, navigation }: any) {
  const { chatId, chatName } = route.params;
  const { user } = useAuth();

  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const chat = await getChatById(chatId);
      if (!chat) return;

      const users: User[] = [];
      for (const uid of chat.members) {
        const u = await getUserById(uid);
        if (u) users.push(u);
      }
      setMembers(users);
    };

    fetchMembers();
  }, [chatId]);

  const handleLeaveChat = async () => {
    if (!user) return;
    try {
      const updatedMembers = members.filter((m) => m.id !== user.uid).map((m) => m.id);
      await updateChatMembers(chatId, updatedMembers);
      Alert.alert("Left chat", "You have left the chat.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to leave chat.");
    }
  };

  const renderMember = ({ item }: { item: User }) => (
    <UserListItem
      user={item}
      onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>{chatName || "Chat Settings"}</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
      />

      <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveChat}>
        <Text style={styles.leaveButtonText}>Leave Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  leaveButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  leaveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
