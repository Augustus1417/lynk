import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "../../components/ProfileAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { acceptFriendRequest, declineFriendRequest, getFriends, getUserById, subscribeIncomingRequests, subscribeOutgoingRequests } from "../../services/userService";
import { User } from "../../types/user";

export default function FriendsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const list = await getFriends(user.uid);
      setFriends(list);
    };
    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubIn = subscribeIncomingRequests(user.uid, setIncoming);
    const unsubOut = subscribeOutgoingRequests(user.uid, setOutgoing);
    return () => { unsubIn?.(); unsubOut?.(); };
  }, [user]);

  // Resolve names for request UIDs
  useEffect(() => {
    const uids = new Set<string>();
    incoming.forEach((r) => uids.add(r.from));
    outgoing.forEach((r) => uids.add(r.to));
    const missing = Array.from(uids).filter((uid) => !userMap[uid]);
    if (missing.length === 0) return;
    (async () => {
      const updates: Record<string, User> = {};
      for (const id of missing) {
        const u = await getUserById(id);
        if (u) updates[id] = u;
      }
      if (Object.keys(updates).length > 0) setUserMap((m) => ({ ...m, ...updates }));
    })();
  }, [incoming, outgoing]);

  const reloadFriends = async () => {
    if (!user) return;
    const list = await getFriends(user.uid);
    setFriends(list);
  };

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id);
    await reloadFriends();
  };

  const handleDecline = async (id: string) => {
    await declineFriendRequest(id);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.lynkId.toLowerCase().includes(q)
    );
  }, [friends, query]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Chats", { screen: "UserProfile", params: { userId: (item as any).id } })}
    >
      <ProfileAvatar uri={item.profilePicture} size={40} name={`${item.firstName} ${item.lastName}`} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.sub}>@{item.lynkId}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <TextInput
        style={styles.input}
        placeholder="Search friends by name or lynk-ID"
        value={query}
        onChangeText={setQuery}
      />
      <View style={{ marginTop: 12 }}>
        <Text style={styles.section}>Incoming Requests</Text>
        {incoming.length === 0 ? (
          <Text style={styles.sub}>No incoming requests</Text>
        ) : (
          incoming.map((r) => (
            <View key={r.id} style={styles.reqRow}>
              <Text style={{ flex: 1 }}>{userMap[r.from] ? `${userMap[r.from].firstName} ${userMap[r.from].lastName}` : r.from}</Text>
              <TouchableOpacity style={[styles.reqBtn, { backgroundColor: "#0ABF53" }]} onPress={() => handleAccept(r.id)}>
                <Text style={styles.reqBtnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.reqBtn, { backgroundColor: "#FF3B30", marginLeft: 8 }]} onPress={() => handleDecline(r.id)}>
                <Text style={styles.reqBtnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={styles.section}>Outgoing Requests</Text>
        {outgoing.length === 0 ? (
          <Text style={styles.sub}>No outgoing requests</Text>
        ) : (
          outgoing.map((r) => (
            <View key={r.id} style={styles.reqRow}>
              <Text style={{ flex: 1 }}>{userMap[r.to] ? `${userMap[r.to].firstName} ${userMap[r.to].lastName}` : r.to}</Text>
              <TouchableOpacity style={[styles.reqBtn, { backgroundColor: "#999" }]} onPress={() => handleDecline(r.id)}>
                <Text style={styles.reqBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => (item as any).id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<Text style={styles.empty}>No friends</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, backgroundColor: "#fff", marginTop: 12 },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontWeight: "bold" },
  sub: { color: "#777", marginTop: 2 },
  empty: { textAlign: "center", marginTop: 24, color: "#777" },
  section: { marginTop: 12, fontWeight: "bold" },
  reqRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  reqBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  reqBtnText: { color: "#fff", fontWeight: "bold" },
});
