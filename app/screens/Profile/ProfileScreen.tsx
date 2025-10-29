import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "../../components/ProfileAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { logoutUser } from "../../services/authService";
import { getUserById, updateUser, uploadProfilePicture } from "../../services/userService";
import { User } from "../../types/user";

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserById(user.uid);
        if (data) setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdate = async (patch: Partial<User>) => {
    if (!user || !userData) return;
    setSaving(true);
    try {
      await updateUser(user.uid, patch);
      setUserData({ ...userData, ...patch });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const onPickImage = async () => {
    if (!user || !userData) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri;
    setSaving(true);
    try {
      const url = await uploadProfilePicture(user.uid, uri);
      setUserData({ ...userData, profilePicture: url });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
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
        <Text>User data not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity style={[styles.button, styles.primary, { width: undefined, paddingVertical: 8, paddingHorizontal: 12 }]} onPress={() => setEditing((e) => !e)}>
          <Text style={styles.buttonText}>{editing ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileAvatar uri={userData.profilePicture} size={120} name={`${userData.firstName} ${userData.lastName}`} />

        {editing && (
          <TouchableOpacity style={[styles.button, styles.primary, { marginTop: 12 }]} onPress={onPickImage} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? "Uploading..." : "Change Photo"}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Name</Text>
        {editing ? (
          <View style={{ width: "100%" }}>
            <TextInput
              style={styles.input}
              value={userData.firstName}
              onChangeText={(t) => setUserData({ ...userData, firstName: t })}
              onEndEditing={() => handleUpdate({ firstName: userData.firstName })}
              placeholder="First name"
            />
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={userData.lastName}
              onChangeText={(t) => setUserData({ ...userData, lastName: t })}
              onEndEditing={() => handleUpdate({ lastName: userData.lastName })}
              placeholder="Last name"
            />
          </View>
        ) : (
          <Text style={styles.value}>{userData.firstName} {userData.lastName}</Text>
        )}

        <Text style={styles.label}>Lynk ID</Text>
        <Text style={styles.value}>@{userData.lynkId}</Text>

        <Text style={styles.label}>Department</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={userData.department}
            onChangeText={(t) => setUserData({ ...userData, department: t })}
            onEndEditing={() => handleUpdate({ department: userData.department })}
          />
        ) : (
          <Text style={styles.value}>{userData.department}</Text>
        )}

        {userData.userType === "student" && (
          <>
            <Text style={styles.label}>Program</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={userData.program || ""}
                onChangeText={(t) => setUserData({ ...userData, program: t })}
                onEndEditing={() => handleUpdate({ program: userData.program || "" })}
              />
            ) : (
              <Text style={styles.value}>{userData.program || "—"}</Text>
            )}

            <Text style={styles.label}>Year</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={userData.year || ""}
                onChangeText={(t) => setUserData({ ...userData, year: t })}
                onEndEditing={() => handleUpdate({ year: userData.year || "" })}
              />
            ) : (
              <Text style={styles.value}>{userData.year || "—"}</Text>
            )}

            <Text style={styles.label}>Section</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={userData.section || ""}
                onChangeText={(t) => setUserData({ ...userData, section: t })}
                onEndEditing={() => handleUpdate({ section: userData.section || "" })}
              />
            ) : (
              <Text style={styles.value}>{userData.section || "—"}</Text>
            )}
          </>
        )}

        {userData.userType === "faculty" && (
          <>
            <Text style={styles.label}>Position</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={userData.position || ""}
                onChangeText={(t) => setUserData({ ...userData, position: t })}
                onEndEditing={() => handleUpdate({ position: userData.position || "" })}
              />
            ) : (
              <Text style={styles.value}>{userData.position || "—"}</Text>
            )}
          </>
        )}

        <Text style={styles.label}>Bio</Text>
        {editing ? (
          <TextInput
            style={[styles.input, { height: 90 }]}
            multiline
            value={userData.bio || ""}
            onChangeText={(t) => setUserData({ ...userData, bio: t })}
            onEndEditing={() => handleUpdate({ bio: userData.bio || "" })}
          />
        ) : (
          <Text style={styles.value}>{userData.bio || "—"}</Text>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.labelInline}>Hide name from search</Text>
          <Switch
            value={!!userData.hideNameFromSearch}
            onValueChange={(v) => {
              setUserData({ ...userData, hideNameFromSearch: v });
              handleUpdate({ hideNameFromSearch: v });
            }}
            disabled={!editing}
          />
        </View>

        <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Saving..." : "Logout"}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { alignSelf: "flex-start", marginTop: 16, marginBottom: 6, color: "#333" },
  labelInline: { color: "#333" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  switchRow: {
    marginTop: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: "100%",
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logout: { backgroundColor: "#FF3B30" },
  primary: { backgroundColor: "#0B93F6" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  value: { alignSelf: "flex-start", color: "#111" },
});
