import { initializeApollo } from "../../../apollo/client";
import { GET_CHECKOUT_SUMMARY } from "../../../apollo/user/query";
import { VALIDATE_CART_FOR_CHECKOUT } from "../../../apollo/user/mutation";

export interface CheckoutSummaryData {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
}

export interface CheckoutValidationIssue {
  code: string;
  message: string;
  productId?: string;
  requestedQty?: number;
  availableQty?: number;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  issues: CheckoutValidationIssue[];
  summary?: CheckoutSummaryData;
}

export async function getCheckoutSummaryServer(): Promise<{
  success: boolean;
  summary?: CheckoutSummaryData;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_CHECKOUT_SUMMARY,
      fetchPolicy: "network-only"
    });

    const summary = data?.getCheckoutSummary;
    if (!summary) {
      return { success: false, error: "Checkout summary is unavailable" };
    }

    return { success: true, summary };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch checkout summary" };
  }
}

export async function validateCheckoutServer(): Promise<{
  success: boolean;
  validation?: CheckoutValidationResult;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({
      mutation: VALIDATE_CART_FOR_CHECKOUT
    });

    const validation = data?.validateCartForCheckout;
    if (!validation) {
      return { success: false, error: "Checkout validation is unavailable" };
    }

    return { success: true, validation };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to validate checkout" };
  }
}
