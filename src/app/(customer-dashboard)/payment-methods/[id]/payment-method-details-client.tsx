"use client";

import AsyncState from "components/AsyncState";
import { PaymentDetailsPageView } from "pages-sections/customer-dashboard/payment-methods/page-view";
import { getCustomerPaymentById } from "utils/services/customer-dashboard";

type Props = { id: string };

export default function PaymentMethodDetailsClient({ id }: Props) {
  const payment = getCustomerPaymentById(id);

  if (!payment) {
    return <AsyncState error="Demo payment profile not found." />;
  }

  return <PaymentDetailsPageView payment={payment} />;
}
