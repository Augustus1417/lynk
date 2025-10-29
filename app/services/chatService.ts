import {
  addDoc,
  arrayUnion,
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
 * Get all chats where the user is a member.
 * Note: This is a one-time fetch. Prefer subscribeToChats for live updates.
 */
export const getChatsForUser = async (uid: string): Promise<Chat[]> => {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("members", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as Chat));
};

/**
 * Get a single chat by ID.
 */
export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const chatDoc = await getDoc(doc(db, "chats", chatId));
  if (!chatDoc.exists()) return null;
  return { id: chatDoc.id, ...chatDoc.data() } as Chat;
};

/**
 * Add a new message to a chat.
 * Also updates parent chat's lastMessage and updatedAt.
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
    const msgs: Message[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Message));
    callback(msgs);
  });

  return unsubscribe;
};

/**
 * Subscribe to all chats for a user, ordered by most recently updated.
 */
export const subscribeToChats = (
  uid: string,
  callback: (chats: Chat[]) => void
) => {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("members", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items: Chat[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Chat));
    callback(items);
  });

  return unsubscribe;
};

/**
 * Update chat members (e.g., remove user when leaving)
 */
export const updateChatMembers = async (chatId: string, members: string[]) => {
  await updateDoc(doc(db, "chats", chatId), { members });
};

/** Ensure a section group chat exists and add the user to it */
export const ensureSectionGroupChat = async (section: string, userId: string) => {
  const name = `Section ${section}`;
  // Try to find by name
  const q = query(collection(db, "chats"), where("name", "==", name));
  const snap = await getDocs(q);
  let chatId: string | null = null;
  if (snap.empty) {
    const ref = await addDoc(collection(db, "chats"), {
      name,
      members: [userId],
      lastMessage: "",
      updatedAt: serverTimestamp(),
      isGroup: true,
    });
    chatId = ref.id;
  } else {
    chatId = snap.docs[0].id;
    // Add user if not already member
    await updateDoc(doc(db, "chats", chatId), { members: arrayUnion(userId), updatedAt: serverTimestamp() });
  }
  return chatId;
};

/** Get or create a direct chat between two users */
export const getOrCreateDirectChat = async (uid1: string, uid2: string): Promise<Chat> => {
  const q = query(collection(db, "chats"), where("members", "array-contains", uid1));
  const snap = await getDocs(q);
  const existing = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .find((c: any) => Array.isArray(c.members) && c.members.includes(uid2) && !c.isGroup);
  if (existing) return existing as Chat;

  const ref = await addDoc(collection(db, "chats"), {
    members: [uid1, uid2],
    lastMessage: "",
    updatedAt: serverTimestamp(),
    isGroup: false,
  });
  const created = await getDoc(doc(db, "chats", ref.id));
  return { id: created.id, ...(created.data() as any) } as Chat;
};
