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
}
