import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

export const registerUser = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};
