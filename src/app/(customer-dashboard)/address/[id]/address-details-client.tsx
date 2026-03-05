"use client";

import AsyncState from "components/AsyncState";
import { useAuth } from "contexts/AuthContext";
import { AddressDetailsPageView } from "pages-sections/customer-dashboard/address/page-view";
import { getCustomerAddressById } from "utils/services/customer-dashboard";

type Props = { id: string };

export default function AddressDetailsClient({ id }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AsyncState loading />;
  if (!user) return <AsyncState error="Unable to load address details." />;

  const address = getCustomerAddressById(user, id);
  if (!address) return <AsyncState error="Address not found." />;

  return <AddressDetailsPageView address={address} />;
}
