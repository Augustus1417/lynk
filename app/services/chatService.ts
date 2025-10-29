import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { Chat } from "../types/chat";
import { Message } from "../types/message";
import { db } from "./firebase";

/**
 * Get all chats where the user is a member
 */
export const getChatsForUser = async (uid: string): Promise<Chat[]> => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Chat))
    .sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() || a.updatedAt || 0;
      const bTime = b.updatedAt?.toMillis?.() || b.updatedAt || 0;
      return bTime - aTime;
    });
};

/**
 * Get a single chat by ID
 */
export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const chatDoc = await getDoc(doc(db, "chats", chatId));
  if (!chatDoc.exists()) return null;
  return { id: chatDoc.id, ...chatDoc.data() } as Chat;
};

/**
 * Add a new message to a chat
 * Also updates parent chat's lastMessage and updatedAt
 */
export const addMessage = async (
  chatId: string,
  message: Omit<Message, "id" | "createdAt">
) => {
  const createdAt = serverTimestamp();
  await addDoc(collection(db, "chats", chatId, "messages"), {
    ...message,
    createdAt,
  });

  // Update the parent chat
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: message.text,
    updatedAt: createdAt,
  });
};

/**
 * Subscribe to messages in a chat (live updates)
 */
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesQuery = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const msgs: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Message));
    callback(msgs);
  });

  return unsubscribe;
};

/**
 * Update chat members (e.g., remove user when leaving)
 */
export const updateChatMembers = async (chatId: string, members: string[]) => {
  await updateDoc(doc(db, "chats", chatId), { members });
};
