import { RouteProp, useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "../../components/ProfileAvatar";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { db } from "../../services/firebase";
import { User } from "../../types/user";

type UserProfileRouteProp = RouteProp<RootStackParamList, "UserProfile">;

export default function UserProfileScreen() {
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params;

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as User);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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

        {userData.position && <Text style={styles.info}>{userData.position}</Text>}
        {userData.department && <Text style={styles.info}>Department: {userData.department}</Text>}
        {userData.program && <Text style={styles.info}>Program: {userData.program}</Text>}
        {userData.year && <Text style={styles.info}>Year: {userData.year}</Text>}
        {userData.section && <Text style={styles.info}>Section: {userData.section}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 16 },
  info: { fontSize: 16, color: "#555", marginTop: 8 },
});
