export type UserRole = "customer" | "vendor" | "admin";

export interface VendorProfile {
  storeName: string;
  storeDescription: string;
  businessLicense: string;
  taxId?: string;
}

export default interface User {
  id: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
  dateOfBirth: Date | string;
  verified: boolean;
  role?: UserRole;
  name: { firstName: string; lastName: string };
  address?: string;
  vendorProfile?: VendorProfile;
}

export interface Profile extends User {
  type: string;
  balance: number;
}
