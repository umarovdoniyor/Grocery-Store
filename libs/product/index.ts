import { initializeApollo } from "../../apollo/client";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  REMOVE_PRODUCT,
  TOGGLE_LIKE,
  RECORD_VIEW
} from "../../apollo/user/mutation";
import {
  GET_MY_PRODUCTS,
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID,
  GET_FEATURED_PRODUCTS,
  GET_POPULAR_PRODUCTS,
  GET_TRENDING_PRODUCTS,
  GET_RELATED_PRODUCTS,
  SEARCH_SUGGESTIONS
} from "../../apollo/user/query";

export type ProductUnit = "PCS" | "KG" | "G" | "L" | "ML" | "PACK";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ProductSortBy = "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";
export type LikeGroup = "PRODUCT" | "MEMBER" | "SHOP" | "VENDOR";
export type ViewGroup = "PRODUCT" | "MEMBER" | "SHOP" | "VENDOR";

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
  meLiked?: boolean;
  meViewed?: boolean;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface CatalogProductsInquiryInput {
  page: number;
  limit: number;
  search?: string;
  categoryIds?: string[];
  brand?: string | null;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: ProductSortBy;
}

export interface FeaturedProductsInquiryInput {
  limit: number;
}

export interface PopularProductsInquiryInput {
  limit: number;
}

export interface TrendingProductsInquiryInput {
  limit: number;
  windowDays?: number;
}

export interface RelatedProductsInquiryInput {
  productId: string;
  limit: number;
}

export interface SearchSuggestionsInput {
  keyword: string;
  limit: number;
}

export interface ToggleLikeInput {
  likeGroup: LikeGroup;
  likeRefId: string;
}

export interface ToggleLikeResponse {
  likeGroup: LikeGroup;
  likeRefId: string;
  liked: boolean;
  totalLikes: number;
}

export interface RecordViewInput {
  viewGroup: ViewGroup;
  viewRefId: string;
}

export interface RecordViewResponse {
  viewGroup: ViewGroup;
  viewRefId: string;
  viewed: boolean;
  totalViews: number;
}

export interface ProductSummary {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  featuredRank?: number | null;
  ratingAvg?: number;
  reviewsCount?: number;
  price: number;
  salePrice?: number;
  stockQty: number;
  status: ProductStatus;
  likes: number;
  views: number;
  createdAt: string;
}

export interface SearchSuggestion {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
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
      fetchPolicy: "cache-first"
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

export async function getProducts(input: CatalogProductsInquiryInput): Promise<{
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
  product?: ProductDetail | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCT_BY_ID,
      variables: { productId },
      fetchPolicy: "cache-first"
    });

    const product = data?.getProductById || null;

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch product";
    return { success: false, error: message };
  }
}

export async function getFeaturedProducts(input: FeaturedProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductSummary[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_FEATURED_PRODUCTS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const list = data?.getFeaturedProducts || [];

    return { success: true, list };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch featured products";
    return { success: false, error: message };
  }
}

export async function getPopularProducts(input: PopularProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductSummary[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_POPULAR_PRODUCTS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const list = data?.getPopularProducts || [];

    return { success: true, list };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch popular products";
    return { success: false, error: message };
  }
}

export async function getTrendingProducts(input: TrendingProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductSummary[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_TRENDING_PRODUCTS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const list = data?.getTrendingProducts || [];

    return { success: true, list };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch trending products";
    return { success: false, error: message };
  }
}

export async function getRelatedProducts(input: RelatedProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductSummary[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_RELATED_PRODUCTS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const list = data?.getRelatedProducts || [];

    return { success: true, list };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch related products";
    return { success: false, error: message };
  }
}

export async function searchSuggestions(input: SearchSuggestionsInput): Promise<{
  success: boolean;
  list?: SearchSuggestion[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: SEARCH_SUGGESTIONS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const list = data?.searchSuggestions || [];

    return { success: true, list };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch search suggestions";
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

export async function toggleLike(input: ToggleLikeInput): Promise<{
  success: boolean;
  like?: ToggleLikeResponse;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: TOGGLE_LIKE,
      variables: { input }
    });

    const like = data?.toggleLike;

    if (!like) {
      return { success: false, error: "Failed to toggle like" };
    }

    return { success: true, like };
  } catch (error: any) {
    const message = error?.message || "Failed to toggle like";
    return { success: false, error: message };
  }
}

export async function recordView(input: RecordViewInput): Promise<{
  success: boolean;
  view?: RecordViewResponse;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: RECORD_VIEW,
      variables: { input }
    });

    const view = data?.recordView;

    if (!view) {
      return { success: false, error: "Failed to record view" };
    }

    return { success: true, view };
  } catch (error: any) {
    const message = error?.message || "Failed to record view";
    return { success: false, error: message };
  }
}
