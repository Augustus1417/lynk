import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { User } from "../../types/user";

type ChatSettingsRouteProp = RouteProp<{ ChatSettings: { chatId: string; chatName?: string } }, "ChatSettings">;

export default function ChatSettings() {
  const route = useRoute<ChatSettingsRouteProp>();
  const { chatId, chatName } = route.params;
  const navigation = useNavigation();
  const { user } = useAuth();

  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (!chatDoc.exists()) return;

      const memberIds: string[] = chatDoc.data()?.members || [];
      const users: User[] = [];

      for (const uid of memberIds) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          users.push(userDoc.data() as User);
        }
      }

      setMembers(users);
    };

    fetchMembers();
  }, [chatId]);

  const handleLeaveChat = async () => {
    if (!user) return;

    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) return;

      const currentMembers: string[] = chatDoc.data()?.members || [];
      const updatedMembers = currentMembers.filter((uid) => uid !== user.uid); 

      await updateDoc(chatRef, { members: updatedMembers });

      Alert.alert("Left chat", "You have left the chat.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to leave chat.");
    }
  };

  const renderMember = ({ item }: { item: User }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberName}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.memberEmail}>{item.email}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{chatName || "Chat Settings"}</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveChat}>
        <Text style={styles.leaveButtonText}>Leave Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  memberItem: { padding: 12, borderBottomWidth: 1, borderColor: "#ccc" },
  memberName: { fontSize: 16, fontWeight: "500" },
  memberEmail: { fontSize: 14, color: "#666" },
  leaveButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  leaveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
