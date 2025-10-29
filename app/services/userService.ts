import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { User } from "../types/user";
import { ensureSectionGroupChat } from "./chatService";
import { db, storage } from "./firebase";

/**
 * Fetch a user document by UID.
 */
export const getUserById = async (uid: string): Promise<User | null> => {
  if (!uid) return null;
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return { ...(userDoc.data() as User), id: userDoc.id };
};

/**
 * Update fields on an existing user document.
 */
export const updateUser = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, "users", uid), data);
};

/**
 * Create a user document with the provided data.
 */
export const createUser = async (uid: string, data: User) => {
  await setDoc(doc(db, "users", uid), data);
  // Auto add to section group chat for students
  if (data.userType === "student" && data.section) {
    try {
      await ensureSectionGroupChat(data.section, uid);
    } catch (e) {
      console.error("Failed to ensure section chat", e);
    }
  }
};

/**
 * Upload a profile picture for a user and return the download URL.
 */
export const uploadProfilePicture = async (uid: string, localUri: string): Promise<string> => {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `users/${uid}/profile.jpg`);
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);
  await updateUser(uid, { profilePicture: url });
  return url;
};

// Friend system types
export type FriendRequestStatus = "pending" | "accepted" | "declined";
export interface FriendRequest {
  id: string;
  from: string;
  to: string;
  status: FriendRequestStatus;
  createdAt: any;
}

/**
 * Send a friend request from one user to another.
 */
export const sendFriendRequest = async (from: string, to: string) => {
  await addDoc(collection(db, "friendRequests"), {
    from,
    to,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};

/** Accept a friend request by id and update both users' friends arrays */
export const acceptFriendRequest = async (requestId: string) => {
  const ref = doc(db, "friendRequests", requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const req = snap.data() as Omit<FriendRequest, "id">;
  await updateDoc(ref, { status: "accepted" });
  await updateDoc(doc(db, "users", req.from), { friends: arrayUnion(req.to) });
  await updateDoc(doc(db, "users", req.to), { friends: arrayUnion(req.from) });
};

/** Decline a friend request by id */
export const declineFriendRequest = async (requestId: string) => {
  await updateDoc(doc(db, "friendRequests", requestId), { status: "declined" });
};

/** Get accepted friends (user objects) for a user id */
export const getFriends = async (uid: string): Promise<User[]> => {
  const u = await getUserById(uid);
  if (!u || !(u as any).friends || !Array.isArray((u as any).friends)) return [];
  const friendIds: string[] = (u as any).friends;
  const users: User[] = [];
  for (const f of friendIds) {
    const friend = await getUserById(f);
    if (friend) users.push(friend);
  }
  return users;
};

/** Incoming pending friend requests for a user */
export const getIncomingRequests = async (uid: string): Promise<FriendRequest[]> => {
  const qRef = query(collection(db, "friendRequests"), where("to", "==", uid), where("status", "==", "pending"));
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

/** Outgoing pending friend requests for a user */
export const getOutgoingRequests = async (uid: string): Promise<FriendRequest[]> => {
  const qRef = query(collection(db, "friendRequests"), where("from", "==", uid), where("status", "==", "pending"));
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

/** Live subscriptions for friend requests */
export const subscribeIncomingRequests = (
  uid: string,
  cb: (requests: FriendRequest[]) => void
) => {
  const qRef = query(collection(db, "friendRequests"), where("to", "==", uid), where("status", "==", "pending"));
  return onSnapshot(qRef, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as FriendRequest[]);
  });
};

export const subscribeOutgoingRequests = (
  uid: string,
  cb: (requests: FriendRequest[]) => void
) => {
  const qRef = query(collection(db, "friendRequests"), where("from", "==", uid), where("status", "==", "pending"));
  return onSnapshot(qRef, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as FriendRequest[]);
  });
};

/** Search helpers */
export const getUserByLynkId = async (lynkId: string): Promise<User | null> => {
  const qRef = query(collection(db, "users"), where("lynkId", "==", lynkId));
  const snap = await getDocs(qRef);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { ...(d.data() as User), id: d.id };
};

/**
 * Prefix search by firstName or lastName; excludes users who hideNameFromSearch.
 */
export const searchUsersByNamePrefix = async (prefix: string): Promise<User[]> => {
  const end = prefix + "\uf8ff";
  const firstNameQ = query(
    collection(db, "users"),
    where("hideNameFromSearch", "==", false),
    where("firstName", ">=", prefix),
    where("firstName", "<=", end)
  );
  const lastNameQ = query(
    collection(db, "users"),
    where("hideNameFromSearch", "==", false),
    where("lastName", ">=", prefix),
    where("lastName", "<=", end)
  );
  const [fnSnap, lnSnap] = await Promise.all([getDocs(firstNameQ), getDocs(lastNameQ)]);
  const map = new Map<string, User>();
  fnSnap.forEach((d) => map.set(d.id, { ...(d.data() as User), id: d.id }));
  lnSnap.forEach((d) => map.set(d.id, { ...(d.data() as User), id: d.id }));
  return Array.from(map.values());
};
