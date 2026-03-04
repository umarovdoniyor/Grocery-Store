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
  balance: number;
  package: string;
  shopName: string;
  published: boolean;
  status: string;
}

export function mapVendorApplicationToSellerRow(
  application: VendorApplicationByAdmin
): AdminSellerRow {
  return {
    id: application._id,
    name: application.storeName,
    phone: "-",
    image: "/assets/images/faces/propic(1).png",
    balance: 0,
    package: "N/A",
    shopName: application.storeName,
    published: application.status === "APPROVED",
    status: application.status
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
  approved: boolean;
}): Promise<{ success: boolean; published?: boolean; status?: string; error?: string }> {
  const response = await reviewVendorApplication(
    input.approved
      ? { applicationId: input.applicationId, status: "APPROVED" }
      : {
          applicationId: input.applicationId,
          status: "REJECTED",
          rejectionReason: "Rejected by admin"
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
