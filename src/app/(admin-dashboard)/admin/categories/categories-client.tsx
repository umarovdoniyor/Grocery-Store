"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import { CategoriesPageView } from "pages-sections/vendor-dashboard/categories/page-view";
import type Category from "models/Category.model";
import { fetchAdminCategoriesForUiByQuery } from "utils/services/admin-categories";

export default function CategoriesClient() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get("q")?.trim() || "";
  const statusRaw = searchParams.get("status")?.trim().toUpperCase() || "";
  const status = ["ACTIVE", "INACTIVE"].includes(statusRaw)
    ? (statusRaw as "ACTIVE" | "INACTIVE")
    : undefined;

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const response = await fetchAdminCategoriesForUiByQuery({
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

      setCategories(response.categories);
      setLoading(false);
    };

    loadCategories();
  }, [query, status]);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return <CategoriesPageView categories={categories} />;
}
