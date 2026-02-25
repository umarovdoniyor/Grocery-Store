import { initializeApollo } from "../../apollo/client";
import { REVIEW_VENDOR_APPLICATION } from "../../apollo/user/mutation";

export interface ReviewVendorApplicationInput {
  applicationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export async function reviewVendorApplication(input: ReviewVendorApplicationInput): Promise<{
  success: boolean;
  application?: any;
  error?: string;
}> {
  try {
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
