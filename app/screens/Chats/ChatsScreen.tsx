import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { getChatsForUser } from "../../services/chatService";
import { Chat } from "../../types/chat";

export default function ChatsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      const userChats = await getChatsForUser(user.uid);

      const sortedChats = userChats.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis?.() || a.updatedAt || 0;
        const bTime = b.updatedAt?.toMillis?.() || b.updatedAt || 0;
        return bTime - aTime;
      });

      setChats(sortedChats);
    };

    fetchChats();
  }, [user]);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatRoom", { chatId: item.id, chatName: item.name })}
    >
      <Text style={styles.chatName}>{item.name}</Text>
      {item.lastMessage && <Text style={styles.lastMessage}>{item.lastMessage}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {chats.length === 0 ? (
        <Text style={styles.emptyText}>No chats yet.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  chatItem: { padding: 12, borderBottomWidth: 1, borderColor: "#ccc" },
  chatName: { fontSize: 16, fontWeight: "bold" },
  lastMessage: { color: "#555", marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#555" },
});
