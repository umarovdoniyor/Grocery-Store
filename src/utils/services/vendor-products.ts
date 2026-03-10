import { getMyProducts, removeProduct, updateProduct, Product } from "../../../libs/product";

export interface VendorProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  published: boolean;
}

function toPlaceholderImage() {
  return "/assets/images/products/placeholder.png";
}

function mapVendorProductsError(message?: string) {
  const fallback = "Failed to fetch vendor products";
  if (!message) return fallback;

  const normalized = message.toLowerCase();
  if (
    normalized.includes("specific roles") ||
    normalized.includes("forbidden") ||
    normalized.includes("unauthorized") ||
    normalized.includes("permission")
  ) {
    return "This account is not recognized as a vendor by the API. Please re-login with a vendor account or refresh your vendor role.";
  }

  return message;
}

export function mapVendorProductToRow(product: Product): VendorProductRow {
  return {
    id: product._id,
    slug: product._id,
    name: product.title,
    brand: product.brand || "-",
    price: product.salePrice ?? product.price,
    image: product.thumbnail || toPlaceholderImage(),
    category: product.categoryIds?.[0] || "-",
    published: product.status === "PUBLISHED"
  };
}

export async function fetchVendorProductsForUi(): Promise<{
  products: VendorProductRow[];
  error?: string;
}> {
  const response = await getMyProducts({ page: 1, limit: 100 });

  if (!response.success) {
    return { products: [], error: mapVendorProductsError(response.error) };
  }

  return {
    products: (response.list || []).map(mapVendorProductToRow)
  };
}

export async function updateVendorProductPublishedForUi(input: {
  productId: string;
  published: boolean;
}): Promise<{ success: boolean; published?: boolean; error?: string }> {
  const response = await updateProduct({
    productId: input.productId,
    status: input.published ? "PUBLISHED" : "DRAFT"
  });

  if (!response.success || !response.product) {
    return { success: false, error: response.error || "Failed to update product status" };
  }

  return { success: true, published: response.product.status === "PUBLISHED" };
}

export async function removeVendorProductForUi(productId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await removeProduct({ productId });

  if (!response.success) {
    return { success: false, error: response.error || "Failed to remove product" };
  }

  return { success: true };
}
