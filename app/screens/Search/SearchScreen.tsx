import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "../../components/ProfileAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { getUserByLynkId, searchUsersByNamePrefix } from "../../services/userService";
import { User } from "../../types/user";

export default function SearchScreen({ navigation }: any) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  const runSearch = useCallback(async () => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      // Exact lynkId match takes precedence
      const byId = await getUserByLynkId(term);
      if (byId) {
        const filtered = user ? (byId as any).id === user.uid ? [] : [byId] : [byId];
        setResults(filtered as any);
      } else {
        const byName = await searchUsersByNamePrefix(term);
        const filtered = user ? byName.filter((u: any) => u.id !== user.uid) : byName;
        setResults(filtered as any);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  }, [query]);

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
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search by name or lynk-ID"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={runSearch}
        />
        <TouchableOpacity style={styles.button} onPress={runSearch} disabled={searching}>
          <Text style={styles.buttonText}>{searching ? "..." : "Search"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => (item as any).id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12 },
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, backgroundColor: "#fff" },
  button: { marginLeft: 8, backgroundColor: "#0B93F6", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontWeight: "bold" },
  sub: { color: "#777", marginTop: 2 },
});