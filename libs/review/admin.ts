import { initializeApollo } from "../../apollo/client";
import { GET_REVIEWS_BY_ADMIN } from "../../apollo/user/query-reviews-by-admin";
import { UPDATE_REVIEW_STATUS_BY_ADMIN } from "../../apollo/user/mutation-update-review-status-by-admin";

export type ProductReviewStatus = "PENDING" | "PUBLISHED" | "HIDDEN" | "REJECTED";

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

export interface ProductReviewSummary {
  ratingAvg: number;
  reviewsCount: number;
  rating1Count: number;
  rating2Count: number;
  rating3Count: number;
  rating4Count: number;
  rating5Count: number;
}

export interface UpdateReviewStatusByAdminInput {
  reviewId: string;
  status: ProductReviewStatus;
  reason?: string;
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
