import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "../../components/ProfileAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { getOrCreateDirectChat } from "../../services/chatService";
import { getFriends, getUserById, sendFriendRequest } from "../../services/userService";
import { User } from "../../types/user";

type UserProfileRouteProp = RouteProp<RootStackParamList, "UserProfile">;

export default function UserProfileScreen({ navigation }: any) {
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params;
  const { user } = useAuth();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const u = await getUserById(userId);
        if (u) setUserData(u);
        if (user) {
          const friends = await getFriends(user.uid);
          setIsFriend(!!friends.find((f: any) => f.id === userId));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, user]);

  const onAddFriend = async () => {
    if (!user) return;
    setSending(true);
    try {
      await sendFriendRequest(user.uid, userId);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const onMessage = async () => {
    if (!user) return;
    try {
      const chat = await getOrCreateDirectChat(user.uid, userId);
      // Navigate into Chats stack
      (navigation as any)?.navigate?.("Chats", { screen: "ChatRoom", params: { chatId: chat.id, chatName: userData ? `${userData.firstName} ${userData.lastName}` : "" } });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileAvatar uri={userData.profilePicture} size={120} name={`${userData.firstName} ${userData.lastName}`} />
        <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
        <Text style={styles.handle}>@{userData.lynkId}</Text>

        {userData.position && <Text style={styles.info}>{userData.position}</Text>}
        {userData.department && <Text style={styles.info}>Department: {userData.department}</Text>}
        {userData.program && <Text style={styles.info}>Program: {userData.program}</Text>}
        {userData.year && <Text style={styles.info}>Year: {userData.year}</Text>}
        {userData.section && <Text style={styles.info}>Section: {userData.section}</Text>}
        {userData.bio && <Text style={styles.info}>{userData.bio}</Text>}

        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={[styles.button, isFriend ? styles.buttonDisabled : styles.buttonPrimary]}
          onPress={onAddFriend}
          disabled={isFriend || sending}
        >
          <Text style={styles.buttonText}>{isFriend ? "Friends" : sending ? "Sending..." : "Add Friend"}</Text>
        </TouchableOpacity>
        {isFriend && (
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={onMessage}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 16 },
  handle: { color: "#777", marginTop: 4 },
  info: { fontSize: 16, color: "#555", marginTop: 8 },
  button: { width: "100%", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonPrimary: { backgroundColor: "#0B93F6" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
