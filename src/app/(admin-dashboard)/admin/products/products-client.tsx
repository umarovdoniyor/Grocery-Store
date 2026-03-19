"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view";
import {
  AdminProductRow,
  fetchAdminProductsForUiByQuery,
  removeAdminProductForUi,
  updateAdminProductFeaturedForUi,
  updateAdminProductPublishedForUi
} from "utils/services/admin-products";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [updatingFeaturedProductId, setUpdatingFeaturedProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

  const query = searchParams.get("q")?.trim() || "";
  const statusRaw = searchParams.get("status")?.trim().toUpperCase() || "";
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusRaw)
    ? (statusRaw as "DRAFT" | "PUBLISHED" | "ARCHIVED")
    : undefined;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const response = await fetchAdminProductsForUiByQuery({
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

      setProducts(response.products);
      setLoading(false);
    };

    loadProducts();
  }, [query, status]);

  const triggerStorefrontRevalidation = async () => {
    const token =
      typeof window !== "undefined" ? window.localStorage.getItem("accessToken") || "" : "";

    if (!token) return;

    try {
      await fetch("/api/revalidate-storefront", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    } catch (revalidateError) {
      console.warn("Failed to revalidate storefront pages:", revalidateError);
    }
  };

  const handleTogglePublished = async (product: AdminProductRow) => {
    setUpdatingProductId(product.id);

    const response = await updateAdminProductPublishedForUi({
      productId: product.id,
      published: !product.published
    });

    if (!response.success || response.published === undefined) {
      setError(response.error || "Failed to update product status");
      setUpdatingProductId(null);
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, published: response.published as boolean } : item
      )
    );
    await triggerStorefrontRevalidation();
    setUpdatingProductId(null);
  };

  const handleRemoveProduct = async (product: AdminProductRow) => {
    setRemovingProductId(product.id);

    const response = await removeAdminProductForUi(product.id);

    if (!response.success) {
      setError(response.error || "Failed to remove product");
      setRemovingProductId(null);
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== product.id));
    setRemovingProductId(null);
  };

  const handleToggleFeatured = async (product: AdminProductRow) => {
    setUpdatingFeaturedProductId(product.id);

    const response = await updateAdminProductFeaturedForUi({
      productId: product.id,
      featured: !product.featured
    });

    if (!response.success || response.featured === undefined) {
      setError(response.error || "Failed to update featured status");
      setUpdatingFeaturedProductId(null);
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              featured: response.featured as boolean,
              featuredRank: response.featuredRank ?? null
            }
          : item
      )
    );
    await triggerStorefrontRevalidation();
    setUpdatingFeaturedProductId(null);
  };

  const handleUpdateFeaturedRank = async (product: AdminProductRow, featuredRank: number) => {
    setUpdatingFeaturedProductId(product.id);

    const response = await updateAdminProductFeaturedForUi({
      productId: product.id,
      featured: true,
      featuredRank
    });

    if (!response.success) {
      setError(response.error || "Failed to update featured rank");
      setUpdatingFeaturedProductId(null);
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              featured: true,
              featuredRank: response.featuredRank ?? featuredRank
            }
          : item
      )
    );
    await triggerStorefrontRevalidation();
    setUpdatingFeaturedProductId(null);
  };

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return (
    <ProductsPageView
      products={products}
      uiMode="admin"
      showCreateButton={false}
      showFeaturedToggle
      updatingProductId={updatingProductId}
      updatingFeaturedProductId={updatingFeaturedProductId}
      removingProductId={removingProductId}
      onTogglePublished={handleTogglePublished}
      onToggleFeatured={handleToggleFeatured}
      onUpdateFeaturedRank={handleUpdateFeaturedRank}
      onRemoveProduct={handleRemoveProduct}
    />
  );
}
