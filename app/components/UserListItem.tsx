import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { User } from "../types/user";
import ProfileAvatar from "./ProfileAvatar";

interface UserListItemProps {
  user: User;
  onPress?: () => void;
  showEmail?: boolean; // optional, defaults to true
  size?: number; // avatar size
}

export default function UserListItem({ user, onPress, showEmail = true, size = 50 }: UserListItemProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  // Optional: display role info if needed
  const roleInfo = user.position
    ? user.position // for faculty
    : user.program
    ? `${user.program} - ${user.year || ""} ${user.section || ""}` // for students
    : "";

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ProfileAvatar uri={user.profilePicture} name={fullName} size={size} />

      <View style={styles.textContainer}>
        <Text style={styles.name}>{fullName}</Text>
        {roleInfo ? <Text style={styles.role}>{roleInfo}</Text> : null}
        {showEmail && user.email ? <Text style={styles.email}>{user.email}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  role: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
});
