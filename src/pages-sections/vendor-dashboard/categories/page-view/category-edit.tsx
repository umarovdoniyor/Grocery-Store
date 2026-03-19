"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AsyncState from "components/AsyncState";
// LOCAL CUSTOM COMPONENT
import CategoryForm from "../category-form";
import PageWrapper from "../../page-wrapper";
import { fetchAdminCategoryForEditById } from "utils/services/admin-categories";
import type { Category as AdminCategory } from "../../../../../libs/admin";

export default function EditCategoryPageView() {
  const params = useParams<{ slug: string }>(); // route param is named [slug] but now holds an ID
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCategory = async () => {
      setLoading(true);

      const response = await fetchAdminCategoryForEditById(params.slug);

      if (cancelled) {
        return;
      }

      if (response.category) {
        setCategory(response.category);
        setError(null);
      } else {
        setError(response.error || "Failed to load category");
      }

      setLoading(false);
    };

    if (params.slug) {
      loadCategory();
    }

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  return (
    <PageWrapper title="Edit Category">
      {loading ? (
        <AsyncState loading />
      ) : error ? (
        <AsyncState error={error} />
      ) : (
        <CategoryForm mode="edit" category={category} uiMode="admin" />
      )}
    </PageWrapper>
  );
}
