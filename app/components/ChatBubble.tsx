import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Message } from "../types/message";
import ProfileAvatar from "./ProfileAvatar";

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
  senderName?: string;
  avatarUrl?: string;
}

export default function ChatBubble({ message, isMe, senderName, avatarUrl }: ChatBubbleProps) {
  const time = message.createdAt?.toDate ? message.createdAt.toDate() : new Date();
  const formattedTime = moment(time).format("h:mm A");

  return (
    <View style={[styles.row, isMe ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
      {!isMe && (
        <ProfileAvatar uri={avatarUrl} size={28} name={senderName} />
      )}
      <View style={[styles.container, isMe ? styles.me : styles.other]}>
        {!isMe && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text style={styles.text}>{message.text}</Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  container: {
    maxWidth: "70%",
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
  },
  me: {
    backgroundColor: "#0B93F6",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  other: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  text: {
    color: "#000",
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  time: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
