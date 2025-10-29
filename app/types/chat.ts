import { Timestamp } from "firebase/firestore";

export interface Chat {
  id: string;
  name?: string;
  lastMessage?: string;
  updatedAt?: Timestamp | null;
  members: string[];
}