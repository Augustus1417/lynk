import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChatRoom from "../screens/Chats/ChatRoom";
import ChatSettings from "../screens/Chats/ChatSettings";
import ChatsScreen from "../screens/Chats/ChatsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import UserProfileScreen from "../screens/Profile/UserProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ChatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatsMain" component={ChatsScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="ChatSettings" component={ChatSettings} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
