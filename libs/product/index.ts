import { initializeApollo } from "../../apollo/client";
import { CREATE_PRODUCT, UPDATE_PRODUCT, REMOVE_PRODUCT } from "../../apollo/user/mutation";
import { GET_MY_PRODUCTS, GET_PRODUCTS, GET_PRODUCT_BY_ID } from "../../apollo/user/query";

export type ProductUnit = "PCS" | "KG" | "G" | "L" | "ML" | "PACK";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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

export interface RemoveProductInput {
  productId: string;
}

export interface MyProductsInquiryInput {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  search?: string;
}

export interface ProductsInquiryInput {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductSummary {
  _id: string;
  title: string;
  status: ProductStatus;
  price: number;
  thumbnail: string;
  categoryIds: string[];
  stockQty: number;
  createdAt: string;
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

export async function getMyProducts(input?: MyProductsInquiryInput): Promise<{
  success: boolean;
  list?: Product[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_PRODUCTS,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getMyProducts?.list || [];
    const total = data?.getMyProducts?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch my products";
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

export async function getProducts(input?: ProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductSummary[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const list = data?.getProducts?.list || [];
    const total = data?.getProducts?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch products";
    return { success: false, error: message };
  }
}

export async function getProductById(productId: string): Promise<{
  success: boolean;
  product?: Product | null;
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

export async function removeProduct(input: RemoveProductInput): Promise<{
  success: boolean;
  product?: Product;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_PRODUCT,
      variables: { input }
    });

    const product = data?.removeProduct;

    if (!product) {
      return { success: false, error: "Failed to remove product" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to remove product";
    return { success: false, error: message };
  }
}
