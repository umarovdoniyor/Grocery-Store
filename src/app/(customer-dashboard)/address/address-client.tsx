"use client";

import AsyncState from "components/AsyncState";
import { useAuth } from "contexts/AuthContext";
import { AddressPageView } from "pages-sections/customer-dashboard/address/page-view/address";
import { getCustomerAddressList } from "utils/services/customer-dashboard";

type Props = { page?: string };

export default function AddressClient({ page }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AsyncState loading />;
  if (!user) return <AsyncState error="Unable to load addresses." />;

  const currentPage = Number.parseInt(page || "1", 10) || 1;
  const data = getCustomerAddressList(user, currentPage);

  return <AddressPageView addresses={data.addressList} totalPages={data.totalPages} />;
}
