import { initializeApollo } from "../../apollo/client";
import {
  GET_MY_PRODUCT_REVIEW,
  GET_PRODUCT_REVIEWS,
  GET_REVIEWS_BY_ADMIN,
  GET_VENDOR_PRODUCT_REVIEWS
} from "../../apollo/user/query";
import {
  CREATE_PRODUCT_REVIEW,
  REMOVE_PRODUCT_REVIEW,
  UPDATE_REVIEW_STATUS_BY_ADMIN,
  UPDATE_PRODUCT_REVIEW
} from "../../apollo/user/mutation";

export type ProductReviewStatus = "PENDING" | "PUBLISHED" | "HIDDEN" | "REJECTED";
export type ProductReviewSortBy =
  | "NEWEST"
  | "OLDEST"
  | "RATING_DESC"
  | "RATING_ASC"
  | "WITH_IMAGES";

export interface ProductReviewsInquiryInput {
  productId: string;
  page: number;
  limit: number;
  sortBy?: ProductReviewSortBy;
}

export interface ReviewsByAdminInquiryInput {
  page: number;
  limit: number;
  status?: ProductReviewStatus;
  productId?: string;
  memberId?: string;
  search?: string;
}

export interface ProductReviewMember {
  _id: string;
  memberNickname?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberAvatar?: string;
}

export interface ProductReview {
  _id: string;
  productId: string;
  memberId: string;
  orderId?: string | null;
  rating: number;
  comment?: string | null;
  images: string[];
  status: ProductReviewStatus;
  moderationReason?: string | null;
  moderatedBy?: string | null;
  moderatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  member?: ProductReviewMember | null;
}

export interface VendorReviewProduct {
  _id: string;
  title: string;
  thumbnail?: string | null;
  slug?: string | null;
}

export interface VendorProductReview extends ProductReview {
  product?: VendorReviewProduct | null;
}

export interface VendorProductReviewsInquiryInput {
  page: number;
  limit: number;
  status?: ProductReviewStatus;
  search?: string;
  productId?: string | null;
  rating?: number | null;
  sortBy?: ProductReviewSortBy;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductReviewSummary {
  ratingAvg: number;
  reviewsCount: number;
  rating1Count: number;
  rating2Count: number;
  rating3Count: number;
  rating4Count: number;
  rating5Count: number;
}

export interface CreateProductReviewInput {
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateProductReviewInput {
  reviewId: string;
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewStatusByAdminInput {
  reviewId: string;
  status: ProductReviewStatus;
  reason?: string;
}

export async function getProductReviews(input: ProductReviewsInquiryInput): Promise<{
  success: boolean;
  list?: ProductReview[];
  total?: number;
  summary?: ProductReviewSummary;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCT_REVIEWS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const payload = data?.getProductReviews;

    return {
      success: true,
      list: payload?.list || [],
      total: payload?.metaCounter?.total || 0,
      summary: {
        ratingAvg: Number(payload?.summary?.ratingAvg || 0),
        reviewsCount: Number(payload?.summary?.reviewsCount || 0),
        rating1Count: Number(payload?.summary?.rating1Count || 0),
        rating2Count: Number(payload?.summary?.rating2Count || 0),
        rating3Count: Number(payload?.summary?.rating3Count || 0),
        rating4Count: Number(payload?.summary?.rating4Count || 0),
        rating5Count: Number(payload?.summary?.rating5Count || 0)
      }
    };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch product reviews";
    return { success: false, error: message };
  }
}

export async function getMyProductReview(productId: string): Promise<{
  success: boolean;
  review?: ProductReview | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_PRODUCT_REVIEW,
      variables: { productId },
      fetchPolicy: "cache-first"
    });

    return {
      success: true,
      review: data?.getMyProductReview || null
    };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch my product review";
    return { success: false, error: message };
  }
}

export async function getReviewsByAdmin(input: ReviewsByAdminInquiryInput): Promise<{
  success: boolean;
  list?: ProductReview[];
  total?: number;
  summary?: ProductReviewSummary;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_REVIEWS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const payload = data?.getReviewsByAdmin;

    return {
      success: true,
      list: payload?.list || [],
      total: payload?.metaCounter?.total || 0,
      summary: {
        ratingAvg: Number(payload?.summary?.ratingAvg || 0),
        reviewsCount: Number(payload?.summary?.reviewsCount || 0),
        rating1Count: Number(payload?.summary?.rating1Count || 0),
        rating2Count: Number(payload?.summary?.rating2Count || 0),
        rating3Count: Number(payload?.summary?.rating3Count || 0),
        rating4Count: Number(payload?.summary?.rating4Count || 0),
        rating5Count: Number(payload?.summary?.rating5Count || 0)
      }
    };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch reviews by admin";
    return { success: false, error: message };
  }
}

export async function getVendorProductReviews(input: VendorProductReviewsInquiryInput): Promise<{
  success: boolean;
  list?: VendorProductReview[];
  meta?: PaginationMeta;
  summary?: ProductReviewSummary;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDOR_PRODUCT_REVIEWS,
      variables: { input },
      fetchPolicy: "cache-first"
    });

    const payload = data?.getVendorProductReviews;

    return {
      success: true,
      list: payload?.list || [],
      meta: {
        total: Number(payload?.metaCounter?.total || 0),
        page: Number(payload?.metaCounter?.page || input.page),
        limit: Number(payload?.metaCounter?.limit || input.limit),
        totalPages: Number(payload?.metaCounter?.totalPages || 1),
        hasNextPage: Boolean(payload?.metaCounter?.hasNextPage),
        hasPrevPage: Boolean(payload?.metaCounter?.hasPrevPage)
      },
      summary: {
        ratingAvg: Number(payload?.summary?.ratingAvg || 0),
        reviewsCount: Number(payload?.summary?.reviewsCount || 0),
        rating1Count: Number(payload?.summary?.rating1Count || 0),
        rating2Count: Number(payload?.summary?.rating2Count || 0),
        rating3Count: Number(payload?.summary?.rating3Count || 0),
        rating4Count: Number(payload?.summary?.rating4Count || 0),
        rating5Count: Number(payload?.summary?.rating5Count || 0)
      }
    };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendor product reviews";
    return { success: false, error: message };
  }
}

export async function createProductReview(input: CreateProductReviewInput): Promise<{
  success: boolean;
  review?: ProductReview;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: CREATE_PRODUCT_REVIEW,
      variables: { input }
    });

    const review = data?.createProductReview;
    if (!review) {
      return { success: false, error: "Failed to create product review" };
    }

    return { success: true, review };
  } catch (error: any) {
    const message = error?.message || "Failed to create product review";
    return { success: false, error: message };
  }
}

export async function updateProductReview(input: UpdateProductReviewInput): Promise<{
  success: boolean;
  review?: ProductReview;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PRODUCT_REVIEW,
      variables: { input }
    });

    const review = data?.updateProductReview;
    if (!review) {
      return { success: false, error: "Failed to update product review" };
    }

    return { success: true, review };
  } catch (error: any) {
    const message = error?.message || "Failed to update product review";
    return { success: false, error: message };
  }
}

export async function removeProductReview(reviewId: string): Promise<{
  success: boolean;
  removed?: boolean;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_PRODUCT_REVIEW,
      variables: { reviewId }
    });

    return {
      success: true,
      removed: Boolean(data?.removeProductReview)
    };
  } catch (error: any) {
    const message = error?.message || "Failed to remove product review";
    return { success: false, error: message };
  }
}

export async function updateReviewStatusByAdmin(input: UpdateReviewStatusByAdminInput): Promise<{
  success: boolean;
  review?: ProductReview;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_REVIEW_STATUS_BY_ADMIN,
      variables: { input }
    });

    const review = data?.updateReviewStatusByAdmin;
    if (!review) {
      return { success: false, error: "Failed to update review status" };
    }

    return { success: true, review };
  } catch (error: any) {
    const message = error?.message || "Failed to update review status";
    return { success: false, error: message };
  }
}
