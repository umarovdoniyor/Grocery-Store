"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import { SellersPageView } from "pages-sections/vendor-dashboard/sellers/page-view";
import {
  AdminSellerRow,
  fetchAdminVendorApplicationsForUiByQuery,
  updateAdminVendorApplicationForUi
} from "utils/services/admin-vendor-applications";

export default function SellersClient() {
  const searchParams = useSearchParams();
  const [sellers, setSellers] = useState<AdminSellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingSellerId, setUpdatingSellerId] = useState<string | null>(null);

  const query = searchParams.get("q")?.trim() || "";
  const statusRaw = searchParams.get("status")?.trim().toUpperCase() || "";
  const status = ["PENDING", "APPROVED", "REJECTED"].includes(statusRaw)
    ? (statusRaw as "PENDING" | "APPROVED" | "REJECTED")
    : undefined;

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      const response = await fetchAdminVendorApplicationsForUiByQuery({
        page: 1,
        limit: 100,
        search: query || undefined,
        status
      });

      if (response.error) {
        setError(response.error);
      } else {
        setError(null);
      }

      setSellers(response.sellers);
      setLoading(false);
    };

    loadApplications();
  }, [query, status]);

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
              status: response.status ?? item.status
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
    const reason = window.prompt(
      "Provide rejection reason",
      "Application details are insufficient"
    );
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
      showCreateButton={false}
      updatingSellerId={updatingSellerId}
      onApproveSeller={handleApproveSeller}
      onRejectSeller={handleRejectSeller}
    />
  );
}
