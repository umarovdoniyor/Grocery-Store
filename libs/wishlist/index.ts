import { initializeApollo } from "../../apollo/client";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../apollo/user/mutation";
import { GET_MY_WISHLIST, GET_WISHLIST_STATUS } from "../../apollo/user/query";

export interface WishlistProductSummary {
  _id: string;
  slug: string;
  title: string;
  thumbnail?: string;
  categoryIds?: string[];
  price: number;
  salePrice?: number;
  status?: string;
}

export interface WishlistItem {
  _id: string;
  memberId: string;
  productId: string;
  createdAt: string;
  product: WishlistProductSummary;
}

export interface WishlistMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getMyWishlist(
  page = 1,
  limit = 10
): Promise<{
  success: boolean;
  list?: WishlistItem[];
  meta?: WishlistMeta;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_WISHLIST,
      variables: { input: { page, limit } },
      fetchPolicy: "cache-first"
    });

    const payload = data?.getMyWishlist;

    return {
      success: true,
      list: payload?.list || [],
      meta: payload?.metaCounter || {
        page,
        limit,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch wishlist" };
  }
}

export async function addToWishlist(productId: string): Promise<{
  success: boolean;
  message?: string;
  productId?: string;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: ADD_TO_WISHLIST,
      variables: { input: { productId } }
    });

    const payload = data?.addToWishlist;
    if (!payload?.success) {
      return { success: false, error: payload?.message || "Failed to add to wishlist" };
    }

    return {
      success: true,
      message: payload.message,
      productId: payload?.wishlistItem?.productId || productId
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to add to wishlist" };
  }
}

export async function removeFromWishlist(productId: string): Promise<{
  success: boolean;
  message?: string;
  productId?: string;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_FROM_WISHLIST,
      variables: { input: { productId } }
    });

    const payload = data?.removeFromWishlist;
    if (!payload?.success) {
      return { success: false, error: payload?.message || "Failed to remove from wishlist" };
    }

    return {
      success: true,
      message: payload.message,
      productId: payload?.removedProductId || productId
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to remove from wishlist" };
  }
}

export async function getWishlistStatus(productIds: string[]): Promise<{
  success: boolean;
  list?: Array<{ productId: string; isWishlisted: boolean }>;
  error?: string;
}> {
  try {
    if (!productIds.length) return { success: true, list: [] };

    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_WISHLIST_STATUS,
      variables: { input: { productIds } },
      fetchPolicy: "cache-first"
    });

    return {
      success: true,
      list: data?.getWishlistStatus?.list || []
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to get wishlist status" };
  }
}
