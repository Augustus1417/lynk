export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  program?: string;
  year?: string;
  section?: string;
  bio?: string;
  lynkId: string;
  hideNameFromSearch: boolean;
  userType: "student" | "faculty";
}
