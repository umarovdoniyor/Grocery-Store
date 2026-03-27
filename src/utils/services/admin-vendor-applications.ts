import {
  getVendorApplicationsByAdmin,
  reviewVendorApplication,
  VendorApplicationByAdmin
} from "../../../libs/admin/vendor-applications";
import { getMembersByAdmin } from "../../../libs/admin/members";
import { resolveMemberImageUrl } from "../../../libs/upload/url";
import { getVendors } from "../../../libs/vendor/list";
import { getApiBaseUrl } from "../getApiBaseUrl";

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

const DEFAULT_SELLER_IMAGE = "/assets/images/faces/propic(1).png";

const resolveSellerImage = (value?: string | null) =>
  resolveMemberImageUrl(value, getApiBaseUrl(), DEFAULT_SELLER_IMAGE);

async function getVendorAvatarMap(): Promise<Map<string, string>> {
  const response = await getMembersByAdmin({
    page: 1,
    limit: 500
  });

  if (!response.success || !response.list) {
    return new Map<string, string>();
  }

  return new Map(
    response.list
      .filter((member) => member.memberType === "VENDOR")
      .map((member) => [member._id, resolveSellerImage(member.memberAvatar)])
  );
}

async function getVendorShopImageMap(): Promise<Map<string, string>> {
  const response = await getVendors({
    page: 1,
    limit: 50,
    status: "ACTIVE",
    sortBy: "NEWEST"
  });

  if (!response.success || !response.list) {
    return new Map<string, string>();
  }

  return new Map(
    response.list.map((vendor) => [
      vendor.storeName.trim().toLowerCase(),
      resolveSellerImage(vendor.coverImage)
    ])
  );
}

export function mapVendorApplicationToSellerRow(
  application: VendorApplicationByAdmin,
  avatar?: string
): AdminSellerRow {
  return {
    id: application._id,
    name: application.storeName,
    phone: "-",
    image: avatar || DEFAULT_SELLER_IMAGE,
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

  const [avatarMap, shopImageMap] = await Promise.all([
    getVendorAvatarMap(),
    getVendorShopImageMap()
  ]);

  return {
    sellers: (response.list || []).map((item) =>
      mapVendorApplicationToSellerRow(
        item,
        shopImageMap.get(item.storeName.trim().toLowerCase()) || avatarMap.get(item.memberId)
      )
    ),
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

  const [avatarMap, shopImageMap] = await Promise.all([
    getVendorAvatarMap(),
    getVendorShopImageMap()
  ]);

  return {
    sellers: (response.list || []).map((item) =>
      mapVendorApplicationToSellerRow(
        item,
        shopImageMap.get(item.storeName.trim().toLowerCase()) || avatarMap.get(item.memberId)
      )
    ),
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
