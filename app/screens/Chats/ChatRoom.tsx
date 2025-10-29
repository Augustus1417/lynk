import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatBubble from "../../components/ChatBubble";
import InputBox from "../../components/InputBox";
import { useAuth } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { db } from "../../services/firebase";
import { Message } from "../../types/message";
import { User } from "../../types/user";

type ChatRoomRouteProp = RouteProp<RootStackParamList, "ChatRoom">;
type ChatRoomNavigationProp = NativeStackNavigationProp<RootStackParamList, "ChatRoom">;

export default function ChatRoom() {
  const route = useRoute<ChatRoomRouteProp>();
  const navigation = useNavigation<ChatRoomNavigationProp>();
  const { chatId, chatName } = route.params;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (!chatDoc.exists()) return;

      const members: string[] = chatDoc.data()?.members || [];
      const map: Record<string, string> = {};
      await Promise.all(
        members.map(async (uid) => {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const u = userDoc.data() as User;
            map[uid] = u.firstName + " " + u.lastName;
          }
        })
      );
      setUsersMap(map);
    };
    fetchUsers();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage.trim(),
      senderId: user.uid,
      createdAt: serverTimestamp(),
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
            <ChatBubble message={item} isMe={item.senderId === user?.uid} senderName={usersMap[item.senderId] || "Unknown"} />
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
