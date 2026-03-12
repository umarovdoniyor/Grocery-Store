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
  total: number;
  error?: string;
}> {
  const response = await getVendorApplicationsByAdmin({
    page: 1,
    limit: 100
  });

  if (!response.success) {
    return {
      sellers: [],
      total: 0,
      error: response.error || "Failed to fetch vendor applications"
    };
  }

  return {
    sellers: (response.list || []).map(mapVendorApplicationToSellerRow),
    total: Number(response.total || 0)
  };
}

export async function fetchAdminVendorApplicationsForUiByQuery(input?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}): Promise<{
  sellers: AdminSellerRow[];
  total: number;
  error?: string;
}> {
  const response = await getVendorApplicationsByAdmin({
    page: input?.page || 1,
    limit: input?.limit || 100,
    search: input?.search || undefined,
    status: input?.status
  });

  if (!response.success) {
    return {
      sellers: [],
      total: 0,
      error: response.error || "Failed to fetch vendor applications"
    };
  }

  return {
    sellers: (response.list || []).map(mapVendorApplicationToSellerRow),
    total: Number(response.total || 0)
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
  if (input.status === "REJECTED" && !input.rejectionReason?.trim()) {
    return {
      success: false,
      error: "Rejection reason is required"
    };
  }

  const response = await reviewVendorApplication(
    input.status === "APPROVED"
      ? { applicationId: input.applicationId, status: "APPROVED" }
      : {
          applicationId: input.applicationId,
          status: "REJECTED",
          rejectionReason: input.rejectionReason!.trim()
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
