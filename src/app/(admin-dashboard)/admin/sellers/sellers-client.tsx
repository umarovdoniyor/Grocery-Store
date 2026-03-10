"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { SellersPageView } from "pages-sections/vendor-dashboard/sellers/page-view";
import {
  AdminSellerRow,
  fetchAdminVendorApplicationsForUi,
  updateAdminVendorApplicationForUi
} from "utils/services/admin-vendor-applications";

export default function SellersClient() {
  const [sellers, setSellers] = useState<AdminSellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingSellerId, setUpdatingSellerId] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      const response = await fetchAdminVendorApplicationsForUi();

      if (response.error) {
        setError(response.error);
      }

      setSellers(response.sellers);
      setLoading(false);
    };

    loadApplications();
  }, []);

  const updateSellerStatus = async (
    seller: AdminSellerRow,
    status: "APPROVED" | "REJECTED",
    rejectionReason?: string
  ) => {
    setUpdatingSellerId(seller.id);
    setError(null);

    const response = await updateAdminVendorApplicationForUi({
      applicationId: seller.id,
      status,
      rejectionReason
    });

    if (!response.success) {
      setError(response.error || "Failed to update vendor application");
      setUpdatingSellerId(null);
      return;
    }

    setSellers((prev) =>
      prev.map((item) =>
        item.id === seller.id
          ? {
              ...item,
              status: response.status as string
            }
          : item
      )
    );
    setUpdatingSellerId(null);
  };

  const handleApproveSeller = (seller: AdminSellerRow) => {
    updateSellerStatus(seller, "APPROVED");
  };

  const handleRejectSeller = (seller: AdminSellerRow) => {
    const reason = window.prompt("Provide rejection reason", "Application details are insufficient");
    if (reason === null) return;

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("Rejection reason is required");
      return;
    }

    updateSellerStatus(seller, "REJECTED", trimmedReason);
  };

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return (
    <SellersPageView
      sellers={sellers}
      updatingSellerId={updatingSellerId}
      onApproveSeller={handleApproveSeller}
      onRejectSeller={handleRejectSeller}
    />
  );
}
