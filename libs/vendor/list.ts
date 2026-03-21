import { initializeApollo } from "../../apollo/client";
import { GET_VENDORS } from "../../apollo/user/query-vendors";

export type VendorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type VendorSortBy = "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC" | "POPULAR";

export interface VendorsInquiryInput {
  page: number;
  limit: number;
  search?: string;
  status?: VendorStatus;
  sortBy?: VendorSortBy;
}

export interface VendorSummary {
  _id: string;
  slug: string;
  storeName: string;
  memberPhone?: string | null;
  memberAddress?: string | null;
  memberImage?: string | null;
  coverImage?: string | null;
  verified: boolean;
  status: VendorStatus;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getVendors(input: VendorsInquiryInput): Promise<{
  success: boolean;
  list?: VendorSummary[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDORS,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getVendors?.list || [];
    const total = data?.getVendors?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendors";
    return { success: false, error: message };
  }
}