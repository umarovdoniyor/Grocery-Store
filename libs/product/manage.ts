import { initializeApollo } from "../../apollo/client";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../apollo/user/mutation";

export type ProductUnit = "PCS" | "KG" | "G" | "L" | "ML" | "PACK";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Product {
  _id: string;
  memberId: string;
  title: string;
  description: string;
  categoryIds: string[];
  brand?: string;
  sku?: string;
  unit: ProductUnit;
  price: number;
  salePrice?: number;
  stockQty: number;
  minOrderQty: number;
  tags: string[];
  images: string[];
  thumbnail: string;
  status: ProductStatus;
  views: number;
  likes: number;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  categoryIds: string[];
  brand?: string;
  sku?: string;
  unit: ProductUnit;
  price: number;
  salePrice?: number;
  stockQty: number;
  minOrderQty?: number;
  tags?: string[];
  images: string[];
  thumbnail?: string;
  status?: ProductStatus;
}

export interface UpdateProductInput {
  productId: string;
  title?: string;
  description?: string;
  categoryIds?: string[];
  brand?: string;
  sku?: string;
  unit?: ProductUnit;
  price?: number;
  salePrice?: number;
  stockQty?: number;
  minOrderQty?: number;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  status?: ProductStatus;
}

export async function createProduct(input: CreateProductInput): Promise<{
  success: boolean;
  product?: Product;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: CREATE_PRODUCT,
      variables: { input }
    });

    const product = data?.createProduct;

    if (!product) {
      return { success: false, error: "Failed to create product" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to create product";
    return { success: false, error: message };
  }
}

export async function updateProduct(input: UpdateProductInput): Promise<{
  success: boolean;
  product?: Product;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PRODUCT,
      variables: { input }
    });

    const product = data?.updateProduct;

    if (!product) {
      return { success: false, error: "Failed to update product" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to update product";
    return { success: false, error: message };
  }
}