import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ChatRoom from "../screens/Chats/ChatRoom";
import ChatSettings from "../screens/Chats/ChatSettings";
import ChatsScreen from "../screens/Chats/ChatsScreen";

// 1️⃣ Define the stack param list
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Chats: undefined;
  ChatRoom: { chatId: string; chatName?: string };
  ChatSettings: { chatId: string; chatName?: string };
};

// 2️⃣ Create stack with types
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
          <Stack.Screen name="ChatSettings" component={ChatSettings} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}