import { initializeApollo } from "../../apollo/client";
import { GET_VENDOR_BY_SLUG, GET_VENDOR_PRODUCTS, GET_VENDORS } from "../../apollo/user/query";

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

export interface VendorDetail extends VendorSummary {
  storeDescription?: string | null;
  memberEmail?: string | null;
}

export interface VendorProductsInquiryInput {
  page: number;
  limit: number;
  sortBy?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";
}

export interface VendorProductSummary {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  price: number;
  salePrice?: number;
  stockQty: number;
  status: string;
  likes: number;
  views: number;
  createdAt: string;
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

export async function getVendorBySlug(slug: string): Promise<{
  success: boolean;
  vendor?: VendorDetail | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDOR_BY_SLUG,
      variables: { slug },
      fetchPolicy: "network-only"
    });

    const vendor = data?.getVendorBySlug || null;

    return { success: true, vendor };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendor by slug";
    return { success: false, error: message };
  }
}

export async function getVendorProducts(input: {
  vendorId: string;
  inquiry: VendorProductsInquiryInput;
}): Promise<{
  success: boolean;
  list?: VendorProductSummary[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDOR_PRODUCTS,
      variables: {
        vendorId: input.vendorId,
        input: input.inquiry
      },
      fetchPolicy: "network-only"
    });

    const list = data?.getVendorProducts?.list || [];
    const total = data?.getVendorProducts?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendor products";
    return { success: false, error: message };
  }
}
