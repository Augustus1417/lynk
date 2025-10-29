export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string,

  // for students
  program?: string;
  year?: string;
  section?: string;

  // for faculty
  position?: string;

  bio?: string;
  lynkId: string;
  hideNameFromSearch: boolean;
  userType: "student" | "faculty";
  profilePicture?: string;

  // FRIENDSHIP
  friends?: string[]; // array of user IDs who are accepted friends
  friendRequestsReceived?: FriendRequest[]; // optional: incoming requests
  friendRequestsSent?: FriendRequest[]; // optional: outgoing requests
}

export interface FriendRequest {
  id: string;          // request doc ID
  from: string;        // sender user ID
  to: string;          // receiver user ID
  status: "pending" | "accepted" | "declined";
  createdAt: any;      // Firestore timestamp
}