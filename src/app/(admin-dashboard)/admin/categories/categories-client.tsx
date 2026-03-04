"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { CategoriesPageView } from "pages-sections/vendor-dashboard/categories/page-view";
import type Category from "models/Category.model";
import { fetchAdminCategoriesForUi } from "utils/services/admin-categories";

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchAdminCategoriesForUi();

      if (response.error) {
        setError(response.error);
      }

      setCategories(response.categories);
      setLoading(false);
    };

    loadCategories();
  }, []);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return <CategoriesPageView categories={categories} />;
}
