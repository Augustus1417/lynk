import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { subscribeToChats } from "../../services/chatService";
import { getUserById } from "../../services/userService";
import { Chat } from "../../types/chat";
import { User } from "../../types/user";

export default function ChatsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToChats(user.uid, setChats);
    return () => unsubscribe();
  }, [user]);

  // Backfill user names for 1:1 chats without name
  useEffect(() => {
    if (!user) return;
    const otherIds = new Set<string>();
    for (const c of chats) {
      if (!c.name && Array.isArray(c.members) && c.members.length === 2) {
        const other = c.members.find((m) => m !== user.uid);
        if (other && !usersMap[other]) otherIds.add(other);
      }
    }
    if (otherIds.size === 0) return;
    (async () => {
      const updates: Record<string, User> = {};
      for (const id of otherIds) {
        const u = await getUserById(id);
        if (u) updates[id] = u;
      }
      if (Object.keys(updates).length) setUsersMap((m) => ({ ...m, ...updates }));
    })();
  }, [chats, user]);

  const getDisplayName = (chat: Chat): string => {
    if (chat.name && chat.name.trim() !== "") return chat.name;
    if (!user || !chat.members) return "Chat";
    const other = chat.members.find((m) => m !== user.uid);
    const u = other ? usersMap[other] : undefined;
    return u ? `${u.firstName} ${u.lastName}` : "Chat";
  };

  const formatUpdatedAt = useMemo(() => {
    return (chat: Chat) => {
      const ts = chat.updatedAt;
      const date = ts && (ts as any).toDate ? (ts as any).toDate() : undefined;
      if (!date) return "";
      const now = new Date();
      const isSameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
      const diffMs = now.getTime() - date.getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      if (isSameDay) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
      } else if (diffMs < 2 * oneDay && now.getDate() - date.getDate() === 1) {
        return "Yesterday";
      }
      return date.toLocaleDateString();
    };
  }, []);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatRoom", { chatId: item.id, chatName: getDisplayName(item) })}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.chatName}>{getDisplayName(item)}</Text>
        <Text style={styles.updatedAt}>{formatUpdatedAt(item)}</Text>
      </View>
      {item.lastMessage && <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>}
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
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chatName: { fontSize: 16, fontWeight: "bold", maxWidth: "70%" },
  updatedAt: { color: "#777", fontSize: 12 },
  lastMessage: { color: "#555", marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#555" },
});
