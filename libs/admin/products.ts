import { initializeApollo } from "../../apollo/client";
import {
  REMOVE_PRODUCT_BY_ADMIN,
  SET_PRODUCT_FEATURED_BY_ADMIN,
  UPDATE_PRODUCT_STATUS_BY_ADMIN
} from "../../apollo/admin/mutation";
import {
  GET_FEATURED_PRODUCTS_BY_ADMIN,
  GET_PRODUCT_BY_ID_BY_ADMIN,
  GET_PRODUCTS_BY_ADMIN
} from "../../apollo/admin/query";

export interface AdminProductsInquiryInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  memberId?: string;
}

export interface UpdateProductStatusByAdminInput {
  productId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface RemoveProductByAdminInput {
  productId: string;
}

export interface SetProductFeaturedByAdminInput {
  productId: string;
  isFeatured: boolean;
  featuredRank?: number;
}

export interface ProductByAdmin {
  _id: string;
  memberId: string;
  title: string;
  description: string;
  categoryIds: string[];
  brand?: string;
  sku?: string;
  unit: string;
  price: number;
  salePrice?: number;
  stockQty: number;
  minOrderQty: number;
  tags: string[];
  images: string[];
  thumbnail: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  views: number;
  likes: number;
  ordersCount: number;
  isFeatured?: boolean;
  featuredRank?: number | null;
  featuredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getProductsByAdmin(input?: AdminProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCTS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getProductsByAdmin?.list || [];
    const total = data?.getProductsByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch products by admin";
    return { success: false, error: message };
  }
}

export async function getFeaturedProductsByAdmin(input?: AdminProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_FEATURED_PRODUCTS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getFeaturedProductsByAdmin?.list || [];
    const total = data?.getFeaturedProductsByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch featured products by admin";
    return { success: false, error: message };
  }
}

export async function getProductByIdByAdmin(productId: string): Promise<{
  success: boolean;
  product?: ProductByAdmin | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCT_BY_ID_BY_ADMIN,
      variables: { productId },
      fetchPolicy: "network-only"
    });

    const product = data?.getProductByIdByAdmin || null;

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch product by admin";
    return { success: false, error: message };
  }
}

export async function updateProductStatusByAdmin(input: UpdateProductStatusByAdminInput): Promise<{
  success: boolean;
  product?: ProductByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PRODUCT_STATUS_BY_ADMIN,
      variables: { input }
    });

    const product = data?.updateProductStatusByAdmin;

    if (!product) {
      return { success: false, error: "Failed to update product status by admin" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to update product status by admin";
    return { success: false, error: message };
  }
}

export async function removeProductByAdmin(input: RemoveProductByAdminInput): Promise<{
  success: boolean;
  product?: ProductByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_PRODUCT_BY_ADMIN,
      variables: { input }
    });

    const product = data?.removeProductByAdmin;

    if (!product) {
      return { success: false, error: "Failed to remove product by admin" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to remove product by admin";
    return { success: false, error: message };
  }
}

export async function setProductFeaturedByAdmin(input: SetProductFeaturedByAdminInput): Promise<{
  success: boolean;
  product?: ProductByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: SET_PRODUCT_FEATURED_BY_ADMIN,
      variables: { input }
    });

    const product = data?.setProductFeaturedByAdmin;

    if (!product) {
      return { success: false, error: "Failed to update featured product by admin" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to update featured product by admin";
    return { success: false, error: message };
  }
}
