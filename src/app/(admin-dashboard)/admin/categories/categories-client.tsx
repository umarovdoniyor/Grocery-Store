"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import {
  AdminCategoryRow,
  fetchAdminCategoriesForUiByQuery,
  removeAdminCategoryForUi,
  updateAdminCategoryStatusForUi
} from "utils/services/admin-categories";

const CategoriesPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/categories/page-view/categories"),
  {
    loading: () => <AsyncState loading />,
    ssr: false
  }
);

export default function CategoriesClient() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState<string | null>(null);
  const [removingCategoryId, setRemovingCategoryId] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const query = searchParams.get("q")?.trim() || "";
  const statusRaw = searchParams.get("status")?.trim().toUpperCase() || "";
  const status = ["ACTIVE", "INACTIVE"].includes(statusRaw)
    ? (statusRaw as "ACTIVE" | "INACTIVE")
    : undefined;

  useEffect(() => {
    const loadCategories = async () => {
      const requestId = ++requestIdRef.current;

      const response = await fetchAdminCategoriesForUiByQuery({
        page: 1,
        limit: 100,
        search: query || undefined,
        status
      });

      if (requestId !== requestIdRef.current) return;

      if (response.error) {
        setError(response.error);
      } else {
        setError(null);
      }

      setCategories(response.categories);
      setLoading(false);
    };

    loadCategories();
  }, [query, status]);

  const handleToggleStatus = async (category: AdminCategoryRow) => {
    setUpdatingCategoryId(category.id);

    const response = await updateAdminCategoryStatusForUi({
      categoryId: category.id,
      active: !category.active
    });

    if (!response.success || response.active === undefined) {
      setError(response.error || "Failed to update category status");
      setUpdatingCategoryId(null);
      return;
    }

    setCategories((prev) =>
      prev.map((item) =>
        item.id === category.id ? { ...item, active: response.active as boolean } : item
      )
    );
    setUpdatingCategoryId(null);
  };

  const handleRemoveCategory = async (category: AdminCategoryRow) => {
    if (!window.confirm(`Delete category \"${category.name}\"?`)) {
      return;
    }

    setRemovingCategoryId(category.id);

    const response = await removeAdminCategoryForUi(category.id);

    if (!response.success) {
      setError(response.error || "Failed to remove category");
      setRemovingCategoryId(null);
      return;
    }

    setCategories((prev) => prev.filter((item) => item.id !== category.id));
    setRemovingCategoryId(null);
  };

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return (
    <CategoriesPageView
      categories={categories}
      uiMode="admin"
      updatingCategoryId={updatingCategoryId}
      removingCategoryId={removingCategoryId}
      onToggleStatus={handleToggleStatus}
      onRemoveCategory={handleRemoveCategory}
    />
  );
}
