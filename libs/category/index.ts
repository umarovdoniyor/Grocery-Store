import { initializeApollo } from "../../apollo/client";
import { GET_CATEGORIES, GET_CATEGORY_BY_ID, GET_CATEGORY_BY_SLUG } from "../../apollo/user/query";

export interface CategoryInquiryInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
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

export async function getCategories(input?: CategoryInquiryInput): Promise<{
  success: boolean;
  list?: Category[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_CATEGORIES,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getCategories?.list || [];
    const total = data?.getCategories?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch categories";
    return { success: false, error: message };
  }
}

export async function getCategoryById(categoryId: string): Promise<{
  success: boolean;
  category?: Category | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_CATEGORY_BY_ID,
      variables: { categoryId },
      fetchPolicy: "network-only"
    });

    const category = data?.getCategoryById || null;

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch category";
    return { success: false, error: message };
  }
}

export async function getCategoryBySlug(slug: string): Promise<{
  success: boolean;
  category?: Category | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_CATEGORY_BY_SLUG,
      variables: { slug },
      fetchPolicy: "network-only"
    });

    const category = data?.getCategoryBySlug || null;

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch category by slug";
    return { success: false, error: message };
  }
}
