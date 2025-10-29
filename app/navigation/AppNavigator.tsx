import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import ProfileAvatar from "../components/ProfileAvatar";
import { useAuth } from "../contexts/AuthContext";
import ChatRoom from "../screens/Chats/ChatRoom";
import ChatSettings from "../screens/Chats/ChatSettings";
import ChatsScreen from "../screens/Chats/ChatsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import UserProfileScreen from "../screens/Profile/UserProfileScreen";
import SearchScreen from "../screens/Search/SearchScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ChatsStack() {
  const { user } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="ChatsMain"
        component={ChatsScreen}
        options={({ navigation }) => ({
          title: "Chats",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Profile" as never)}>
              <View style={{ marginRight: 8 }}>
                <ProfileAvatar name={user?.displayName || undefined} size={28} />
              </View>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ title: "Chat" }} />
      <Stack.Screen name="ChatSettings" component={ChatSettings} options={{ title: "Settings" }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: "Profile" }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "Chats") iconName = "chatbubble-outline";
          else if (route.name === "Search") iconName = "search-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          return {
            tabBarStyle:
              routeName === "ChatRoom" || routeName === "ChatSettings"
                ? { display: "none" }
                : undefined,
          };
        }}
      />
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: true, title: "Search" }} />
      <Tab.Screen
        name="Friends"
        component={require("../screens/Profile/FriendsScreen").default}
        options={{
          headerShown: true,
          title: "Friends",
          tabBarIcon: ({ color, size }) => (<Ionicons name="people-outline" size={size} color={color} />)
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: "Profile" }} />
    </Tab.Navigator>
  );
}
