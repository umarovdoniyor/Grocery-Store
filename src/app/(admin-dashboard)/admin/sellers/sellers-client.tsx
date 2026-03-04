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

  const handleToggleSeller = async (seller: AdminSellerRow) => {
    setUpdatingSellerId(seller.id);

    const response = await updateAdminVendorApplicationForUi({
      applicationId: seller.id,
      approved: !seller.published
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
              published: response.published as boolean,
              status: response.status as string
            }
          : item
      )
    );
    setUpdatingSellerId(null);
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
      onToggleSeller={handleToggleSeller}
    />
  );
}
