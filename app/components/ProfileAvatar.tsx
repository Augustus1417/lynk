import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface ProfileAvatarProps {
  uri?: string;
  size?: number;
  name?: string; 
}

export default function ProfileAvatar({ uri, size = 80, name }: ProfileAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return uri && uri.trim() !== "" ? (
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
    />
  ) : (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size / 2 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "bold",
  },
});
