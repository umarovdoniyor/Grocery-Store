import { initializeApollo } from "../../apollo/client";
import { REVIEW_VENDOR_APPLICATION } from "../../apollo/user/mutation-review-vendor-application";
import { GET_VENDOR_APPLICATIONS_BY_ADMIN } from "../../apollo/admin/query-vendor-applications";

export interface VendorApplicationsInquiryInput {
  page: number;
  limit: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
}

export type ReviewVendorApplicationInput =
  | {
      applicationId: string;
      status: "APPROVED";
      rejectionReason?: never;
    }
  | {
      applicationId: string;
      status: "REJECTED";
      rejectionReason: string;
    };

export interface VendorApplicationByAdmin {
  _id: string;
  memberId: string;
  storeName: string;
  description?: string;
  businessLicenseUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function reviewVendorApplication(input: ReviewVendorApplicationInput): Promise<{
  success: boolean;
  application?: VendorApplicationByAdmin;
  error?: string;
}> {
  try {
    if (input.status === "REJECTED" && !input.rejectionReason.trim()) {
      return {
        success: false,
        error: "Rejection reason is required when rejecting an application"
      };
    }

    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REVIEW_VENDOR_APPLICATION,
      variables: { input }
    });

    const application = data?.reviewVendorApplication;

    if (!application) {
      return { success: false, error: "Failed to review vendor application" };
    }

    return { success: true, application };
  } catch (error: any) {
    const message = error?.message || "Failed to review vendor application";
    return { success: false, error: message };
  }
}

export async function getVendorApplicationsByAdmin(input: VendorApplicationsInquiryInput): Promise<{
  success: boolean;
  list?: VendorApplicationByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDOR_APPLICATIONS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getVendorApplicationsByAdmin?.list || [];
    const total = data?.getVendorApplicationsByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendor applications by admin";
    return { success: false, error: message };
  }
}