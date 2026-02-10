export type UserRole = "customer" | "vendor" | "admin";

export default interface User {
  id: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
  dateOfBirth: Date | string;
  verified: boolean;
  role: UserRole;
  name: { firstName: string; lastName: string };
}

export interface Profile extends User {
  type: string;
  balance: number;
}
