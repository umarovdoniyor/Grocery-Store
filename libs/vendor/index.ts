import { initializeApollo } from "../../apollo/client";
import { UPDATE_MY_VENDOR_PROFILE } from "../../apollo/user/mutation";
import { UPDATE_MY_VENDOR_ORDER_ITEM_STATUS } from "../../apollo/user/mutation";
import {
  GET_VENDOR_DASHBOARD_SUMMARY,
  GET_MY_VENDOR_PROFILE,
  GET_VENDOR_BY_SLUG,
  GET_VENDOR_PRODUCTS,
  GET_VENDORS
} from "../../apollo/user/query";

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

export interface MyVendorProfile {
  _id: string;
  memberId: string;
  storeName: string;
  storeDescription?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  minimumOrderQty?: number | null;
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMyVendorProfileInput {
  storeName?: string;
  storeDescription?: string;
  coverImageUrl?: string;
  category?: string;
  minimumOrderQty?: number;
}

export type VendorOrderItemStatus = "PACKING" | "SHIPPED" | "DELIVERED";

export interface UpdateMyVendorOrderItemStatusInput {
  orderId: string;
  itemId: string;
  status: VendorOrderItemStatus;
}

export interface UpdatedVendorOrderItemStatus {
  orderId: string;
  itemId: string;
  status: VendorOrderItemStatus;
  updatedAt: string;
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

export interface VendorDashboardSummary {
  products: {
    total: number;
    published: number;
    draft: number;
    lowStock: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  revenue: {
    gross: number;
    currency: string;
  };
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

export async function getMyVendorProfile(): Promise<{
  success: boolean;
  profile?: MyVendorProfile | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_VENDOR_PROFILE,
      fetchPolicy: "network-only"
    });

    return { success: true, profile: data?.getMyVendorProfile || null };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch my vendor profile";
    return { success: false, error: message };
  }
}

export async function getVendorDashboardSummary(): Promise<{
  success: boolean;
  summary?: VendorDashboardSummary;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDOR_DASHBOARD_SUMMARY,
      fetchPolicy: "network-only"
    });

    const summary = data?.getVendorDashboardSummary;
    if (!summary) {
      return { success: false, error: "Failed to fetch vendor dashboard summary" };
    }

    return { success: true, summary };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendor dashboard summary";
    return { success: false, error: message };
  }
}

export async function updateMyVendorProfile(input: UpdateMyVendorProfileInput): Promise<{
  success: boolean;
  profile?: MyVendorProfile;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_MY_VENDOR_PROFILE,
      variables: { input }
    });

    const profile = data?.updateMyVendorProfile;
    if (!profile) {
      return { success: false, error: "Failed to update vendor profile" };
    }

    return { success: true, profile };
  } catch (error: any) {
    const message = error?.message || "Failed to update vendor profile";
    return { success: false, error: message };
  }
}

export async function updateMyVendorOrderItemStatus(
  input: UpdateMyVendorOrderItemStatusInput
): Promise<{
  success: boolean;
  result?: UpdatedVendorOrderItemStatus;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_MY_VENDOR_ORDER_ITEM_STATUS,
      variables: { input }
    });

    const result = data?.updateMyVendorOrderItemStatus;
    if (!result) {
      return { success: false, error: "Failed to update vendor order item status" };
    }

    return { success: true, result };
  } catch (error: any) {
    const message = error?.message || "Failed to update vendor order item status";
    return { success: false, error: message };
  }
}
