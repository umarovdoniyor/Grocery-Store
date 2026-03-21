import { initializeApollo } from "../../apollo/client";
import { UPDATE_MY_VENDOR_PROFILE } from "../../apollo/user/mutation";

export type VendorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface MyVendorProfile {
  _id: string;
  memberId: string;
  storeName: string;
  storeDescription?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  minimumOrderQty?: number | null;
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMyVendorProfileInput {
  storeName?: string;
  storeDescription?: string;
  coverImageUrl?: string;
  category?: string;
  minimumOrderQty?: number;
}

export async function updateMyVendorProfile(input: UpdateMyVendorProfileInput): Promise<{
  success: boolean;
  profile?: MyVendorProfile;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_MY_VENDOR_PROFILE,
      variables: { input }
    });

    const profile = data?.updateMyVendorProfile;
    if (!profile) {
      return { success: false, error: "Failed to update vendor profile" };
    }

    return { success: true, profile };
  } catch (error: any) {
    const message = error?.message || "Failed to update vendor profile";
    return { success: false, error: message };
  }
}
