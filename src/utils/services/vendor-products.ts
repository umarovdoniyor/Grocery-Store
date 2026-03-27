import { getCategories } from "../../../libs/category";
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

type CategoryNameMap = Map<string, string>;

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

function mapVendorProductToRow(
  product: Product,
  categoryNameMap?: CategoryNameMap
): VendorProductRow {
  return {
    id: product._id,
    slug: product._id,
    name: product.title,
    brand: product.brand || "-",
    price: product.salePrice ?? product.price,
    image: product.thumbnail || toPlaceholderImage(),
    category:
      categoryNameMap?.get(product.categoryIds?.[0] || "") || product.categoryIds?.[0] || "-",
    published: product.status === "PUBLISHED"
  };
}

async function getCategoryNameMap(): Promise<CategoryNameMap> {
  const response = await getCategories({ page: 1, limit: 500 });
  const map = new Map<string, string>();

  if (!response.success) return map;

  (response.list || []).forEach((category) => {
    map.set(category._id, category.name);
  });

  return map;
}

export async function fetchVendorProductsForUi(): Promise<{
  products: VendorProductRow[];
  error?: string;
}> {
  const [response, categoryNameMap] = await Promise.all([
    getMyProducts({ page: 1, limit: 50 }),
    getCategoryNameMap()
  ]);

  if (!response.success) {
    return { products: [], error: mapVendorProductsError(response.error) };
  }

  return {
    products: (response.list || []).map((product) =>
      mapVendorProductToRow(product, categoryNameMap)
    )
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
