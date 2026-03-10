export interface Seller {
  id: string;
  name: string;
  phone: string;
  image: string;
  shopName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  description?: string;
  businessLicenseUrl?: string;
  rejectionReason?: string | null;
  createdAt: string;
}
