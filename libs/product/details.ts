import { initializeApollo } from "../../apollo/client";
import { GET_PRODUCT_BY_ID } from "../../apollo/user/query-product-by-id";
import type { Product, ProductStatus, ProductUnit } from "./manage";

export interface ProductVendor {
  _id: string;
  memberNickname?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberAvatar?: string;
  memberType: string;
}

export interface ProductDetail extends Product {
  slug: string;
  meLiked: boolean;
  meViewed: boolean;
  vendor?: ProductVendor | null;
}

export type { Product, ProductStatus, ProductUnit };

export async function getProductById(productId: string): Promise<{
  success: boolean;
  product?: ProductDetail | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCT_BY_ID,
      variables: { productId },
      fetchPolicy: "network-only"
    });

    const product = data?.getProductById || null;

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch product";
    return { success: false, error: message };
  }
}