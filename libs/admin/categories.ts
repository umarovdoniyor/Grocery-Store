import { initializeApollo } from "../../apollo/client";
import { CREATE_CATEGORY, REMOVE_CATEGORY, UPDATE_CATEGORY } from "../../apollo/admin/mutation";
import { GET_CATEGORIES_BY_ADMIN } from "../../apollo/admin/query";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortOrder?: number;
  parentId?: string | null;
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
  parentId?: string | null;
}

export interface CategoryInquiryInput {
  page: number;
  limit: number;
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
  parentId?: string | null;
}

export interface RemoveCategoryInput {
  categoryId: string;
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
