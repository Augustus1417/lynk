import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import chats from './../mock/chats.json';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#D32F2F', '#C62828', '#B71C1C']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-processing" size={60} color="#fff" />
        </View>
        <Text style={styles.title}>Lynk</Text>
        <Text style={styles.subtitle}>Chats</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() => router.push(`/chat?id=${item.id}`)}
            >
              <View style={styles.avatar}>
                <MaterialCommunityIcons
                  name={item.type === 'group' ? 'account-group' : 'account'}
                  size={32}
                  color="#C62828"
                />
              </View>

              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.messages[item.messages.length - 1]?.text}
                </Text>
              </View>

              <Text style={styles.timestamp}>Now</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 15,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fce4ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatInfo: { flex: 1 },
  chatName: { fontWeight: '700', fontSize: 16, color: '#B71C1C' },
  lastMessage: { color: '#555', fontSize: 14 },
  timestamp: { color: '#888', fontSize: 12 },
});
