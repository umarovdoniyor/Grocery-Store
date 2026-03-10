import {
  getVendorApplicationsByAdmin,
  reviewVendorApplication,
  VendorApplicationByAdmin
} from "../../../libs/admin";

export interface AdminSellerRow {
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

export function mapVendorApplicationToSellerRow(
  application: VendorApplicationByAdmin
): AdminSellerRow {
  return {
    id: application._id,
    name: application.storeName,
    phone: "-",
    image: "/assets/images/faces/propic(1).png",
    shopName: application.storeName,
    status: application.status,
    description: application.description,
    businessLicenseUrl: application.businessLicenseUrl,
    rejectionReason: application.rejectionReason,
    createdAt: application.createdAt
  };
}

export async function fetchAdminVendorApplicationsForUi(): Promise<{
  sellers: AdminSellerRow[];
  error?: string;
}> {
  const response = await getVendorApplicationsByAdmin({
    page: 1,
    limit: 100
  });

  if (!response.success) {
    return { sellers: [], error: response.error || "Failed to fetch vendor applications" };
  }

  return {
    sellers: (response.list || []).map(mapVendorApplicationToSellerRow)
  };
}

export async function updateAdminVendorApplicationForUi(input: {
  applicationId: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}): Promise<{
  success: boolean;
  published?: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  error?: string;
}> {
  const response = await reviewVendorApplication(
    input.status === "APPROVED"
      ? { applicationId: input.applicationId, status: "APPROVED" }
      : {
          applicationId: input.applicationId,
          status: "REJECTED",
          rejectionReason: (input.rejectionReason || "Rejected by admin").trim()
        }
  );

  if (!response.success || !response.application) {
    return {
      success: false,
      error: response.error || "Failed to review vendor application"
    };
  }

  return {
    success: true,
    published: response.application.status === "APPROVED",
    status: response.application.status
  };
}
