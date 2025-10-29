import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { User } from "../types/user";
import { db } from "./firebase";

export const getUserById = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return userDoc.data() as User;
};

export const updateUser = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, "users", uid), data);
};

export const createUser = async (uid: string, data: User) => {
  await setDoc(doc(db, "users", uid), data);
};
