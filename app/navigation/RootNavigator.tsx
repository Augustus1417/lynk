import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import AppNavigator from "./AppNavigator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  App: undefined;
  UserProfile: { userId: string };
  ChatRoom: { chatId: string; chatName?: string };
  ChatSettings: { chatId: string; chatName?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="App" component={AppNavigator} />
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
