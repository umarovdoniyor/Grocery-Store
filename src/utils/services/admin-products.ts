import {
  getFeaturedProductsByAdmin,
  getProductsByAdmin,
  removeProductByAdmin,
  setProductFeaturedByAdmin,
  updateProductStatusByAdmin,
  ProductByAdmin
} from "../../../libs/admin";

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  published: boolean;
  featured: boolean;
  featuredRank?: number | null;
}

function toPlaceholderImage() {
  return "/assets/images/products/placeholder.png";
}

export function mapAdminProductToRow(product: ProductByAdmin): AdminProductRow {
  return {
    id: product._id,
    slug: product._id,
    name: product.title,
    brand: product.brand || "-",
    price: product.salePrice ?? product.price,
    image: product.thumbnail || toPlaceholderImage(),
    category: product.categoryIds?.[0] || "-",
    published: product.status === "PUBLISHED",
    featured: Boolean(product.isFeatured),
    featuredRank: product.featuredRank ?? null
  };
}

export async function fetchAdminProductsForUi(): Promise<{
  products: AdminProductRow[];
  total: number;
  error?: string;
}> {
  const response = await getProductsByAdmin({ page: 1, limit: 100 });

  if (!response.success) {
    return { products: [], total: 0, error: response.error || "Failed to fetch admin products" };
  }

  return {
    products: (response.list || []).map(mapAdminProductToRow),
    total: Number(response.total || 0)
  };
}

export async function fetchAdminProductsForUiByQuery(input?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}): Promise<{
  products: AdminProductRow[];
  total: number;
  error?: string;
}> {
  const response = await getProductsByAdmin({
    page: input?.page || 1,
    limit: input?.limit || 100,
    search: input?.search || undefined,
    status: input?.status
  });

  if (!response.success) {
    return { products: [], total: 0, error: response.error || "Failed to fetch admin products" };
  }

  return {
    products: (response.list || []).map(mapAdminProductToRow),
    total: Number(response.total || 0)
  };
}

export async function fetchAdminFeaturedProductsForUiByQuery(input?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}): Promise<{
  products: AdminProductRow[];
  total: number;
  error?: string;
}> {
  const response = await getFeaturedProductsByAdmin({
    page: input?.page || 1,
    limit: input?.limit || 100,
    search: input?.search || undefined,
    status: input?.status
  });

  if (!response.success) {
    return { products: [], total: 0, error: response.error || "Failed to fetch featured products" };
  }

  return {
    products: (response.list || []).map(mapAdminProductToRow),
    total: Number(response.total || 0)
  };
}

export async function updateAdminProductPublishedForUi(input: {
  productId: string;
  published: boolean;
}): Promise<{ success: boolean; published?: boolean; error?: string }> {
  const response = await updateProductStatusByAdmin({
    productId: input.productId,
    status: input.published ? "PUBLISHED" : "DRAFT"
  });

  if (!response.success || !response.product) {
    return { success: false, error: response.error || "Failed to update product status" };
  }

  return { success: true, published: response.product.status === "PUBLISHED" };
}

export async function updateAdminProductFeaturedForUi(input: {
  productId: string;
  featured: boolean;
  featuredRank?: number;
}): Promise<{
  success: boolean;
  featured?: boolean;
  featuredRank?: number | null;
  error?: string;
}> {
  const response = await setProductFeaturedByAdmin({
    productId: input.productId,
    isFeatured: input.featured,
    featuredRank: input.featuredRank
  });

  if (!response.success || !response.product) {
    return { success: false, error: response.error || "Failed to update featured product" };
  }

  return {
    success: true,
    featured: Boolean(response.product.isFeatured),
    featuredRank: response.product.featuredRank ?? null
  };
}

export async function removeAdminProductForUi(productId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await removeProductByAdmin({ productId });

  if (!response.success) {
    return { success: false, error: response.error || "Failed to remove product" };
  }

  return { success: true };
}
