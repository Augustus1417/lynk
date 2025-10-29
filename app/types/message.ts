export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt?: any; // Firestore timestamp
}
