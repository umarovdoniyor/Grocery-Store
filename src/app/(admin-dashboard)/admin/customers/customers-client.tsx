"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import { CustomersPageView } from "pages-sections/vendor-dashboard/customers/page-view";
import {
  AdminCustomerRow,
  fetchAdminCustomersForUiByQuery,
  updateAdminMemberStatusForUi
} from "utils/services/admin-members";

export default function CustomersClient() {
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<AdminCustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  const query = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      const response = await fetchAdminCustomersForUiByQuery({
        page: 1,
        limit: 100,
        search: query || undefined,
        memberStatus: status || undefined
      });

      if (response.error) {
        setError(response.error);
      } else {
        setError(null);
      }

      setCustomers(response.customers);
      setLoading(false);
    };

    loadCustomers();
  }, [query, status]);

  const handleToggleMemberStatus = async (customer: AdminCustomerRow) => {
    const nextStatus = customer.memberStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const reason = nextStatus === "SUSPENDED" ? "Suspended by admin" : "Reactivated by admin";

    setUpdatingMemberId(customer.id);

    const response = await updateAdminMemberStatusForUi({
      memberId: customer.id,
      status: nextStatus,
      reason
    });

    if (!response.success || !response.status) {
      setError(response.error || "Failed to update member status");
      setUpdatingMemberId(null);
      return;
    }

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id ? { ...item, memberStatus: response.status as string } : item
      )
    );
    setUpdatingMemberId(null);
  };

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return (
    <CustomersPageView
      customers={customers}
      updatingMemberId={updatingMemberId}
      onToggleMemberStatus={handleToggleMemberStatus}
    />
  );
}
