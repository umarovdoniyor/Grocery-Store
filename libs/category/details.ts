import { initializeApollo } from "../../apollo/client";
import { GET_CATEGORY_BY_ID, GET_CATEGORY_BY_SLUG } from "../../apollo/user/query";
import type { Category } from "./list";

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
      fetchPolicy: "cache-first"
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
      fetchPolicy: "cache-first"
    });

    const category = data?.getCategoryBySlug || null;

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch category by slug";
    return { success: false, error: message };
  }
}
