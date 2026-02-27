import { initializeApollo } from "../../apollo/client";
import { REVIEW_VENDOR_APPLICATION } from "../../apollo/user/mutation";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  UPDATE_PRODUCT_STATUS_BY_ADMIN,
  REMOVE_PRODUCT_BY_ADMIN
} from "../../apollo/admin/mutation";
import {
  GET_CATEGORIES_BY_ADMIN,
  GET_PRODUCTS_BY_ADMIN,
  GET_PRODUCT_BY_ID_BY_ADMIN
} from "../../apollo/admin/query";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortOrder?: number;
  parentId?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCategoryInput {
  categoryId: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortOrder?: number;
  parentId?: string;
}

export interface CategoryInquiryInput {
  page: number;
  limit: number;
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
  parentId?: string;
}

export interface AdminProductsInquiryInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface RemoveCategoryInput {
  categoryId: string;
}

export interface UpdateProductStatusByAdminInput {
  productId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface RemoveProductByAdminInput {
  productId: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ReviewVendorApplicationInput {
  applicationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export async function reviewVendorApplication(input: ReviewVendorApplicationInput): Promise<{
  success: boolean;
  application?: any;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REVIEW_VENDOR_APPLICATION,
      variables: { input }
    });

    const application = data?.reviewVendorApplication;

    if (!application) {
      return { success: false, error: "Failed to review vendor application" };
    }

    return { success: true, application };
  } catch (error: any) {
    const message = error?.message || "Failed to review vendor application";
    return { success: false, error: message };
  }
}

export async function createCategory(input: CreateCategoryInput): Promise<{
  success: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: CREATE_CATEGORY,
      variables: { input }
    });

    const category = data?.createCategory;

    if (!category) {
      return { success: false, error: "Failed to create category" };
    }

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to create category";
    return { success: false, error: message };
  }
}

export async function updateCategory(input: UpdateCategoryInput): Promise<{
  success: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CATEGORY,
      variables: { input }
    });

    const category = data?.updateCategory;

    if (!category) {
      return { success: false, error: "Failed to update category" };
    }

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to update category";
    return { success: false, error: message };
  }
}

export async function getCategoriesByAdmin(input: CategoryInquiryInput): Promise<{
  success: boolean;
  list?: Category[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_CATEGORIES_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getCategoriesByAdmin?.list || [];
    const total = data?.getCategoriesByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch categories by admin";
    return { success: false, error: message };
  }
}

export async function removeCategory(input: RemoveCategoryInput): Promise<{
  success: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_CATEGORY,
      variables: { input }
    });

    const category = data?.removeCategory;

    if (!category) {
      return { success: false, error: "Failed to remove category" };
    }

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to remove category";
    return { success: false, error: message };
  }
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
