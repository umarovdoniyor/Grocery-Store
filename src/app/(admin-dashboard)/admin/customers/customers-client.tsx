"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { CustomersPageView } from "pages-sections/vendor-dashboard/customers/page-view";
import {
  AdminCustomerRow,
  fetchAdminCustomersForUi,
  updateAdminMemberStatusForUi
} from "utils/services/admin-members";

export default function CustomersClient() {
  const [customers, setCustomers] = useState<AdminCustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      const response = await fetchAdminCustomersForUi();

      if (response.error) {
        setError(response.error);
      }

      setCustomers(response.customers);
      setLoading(false);
    };

    loadCustomers();
  }, []);

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
