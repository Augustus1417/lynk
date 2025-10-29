import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";

interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt?: any;
  members: string[];
}

export default function ChatsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("members", "array-contains", user.uid));


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: Chat[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Chat));
      setChats(chatList);
    });

    return () => unsubscribe();
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
    <View style={styles.container}>
      {chats.length === 0 ? (
        <Text style={styles.emptyText}>No chats yet.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  chatItem: { padding: 12, borderBottomWidth: 1, borderColor: "#ccc" },
  chatName: { fontSize: 16, fontWeight: "bold" },
  lastMessage: { color: "#555", marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#555" },
});
