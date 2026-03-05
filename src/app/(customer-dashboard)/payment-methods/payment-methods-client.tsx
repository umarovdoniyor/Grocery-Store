"use client";

import { PaymentMethodsPageView } from "pages-sections/customer-dashboard/payment-methods/page-view";
import { getCustomerPayments } from "utils/services/customer-dashboard";

type Props = { page?: string };

export default function PaymentMethodsClient({ page }: Props) {
  const currentPage = Number.parseInt(page || "1", 10) || 1;
  const data = getCustomerPayments(currentPage);

  return <PaymentMethodsPageView payments={data.payments} totalPages={data.totalPages} />;
}
