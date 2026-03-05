import type Product from "models/Product.model";
import type Shop from "models/Shop.model";
import {
  getFeaturedProducts,
  getProductById,
  getRelatedProducts,
  searchSuggestions,
  type ProductDetail,
  type ProductSummary
} from "../../../libs/product";

const toDiscount = (price: number, salePrice?: number) => {
  if (!salePrice || price <= salePrice || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const mapVendorToShop = (vendor?: ProductDetail["vendor"]): Shop | undefined => {
  if (!vendor?._id) return undefined;

  const shopName =
    vendor.memberNickname ||
    `${vendor.memberFirstName || ""} ${vendor.memberLastName || ""}`.trim();

  return {
    id: vendor._id,
    slug: vendor._id,
    user: {
      id: vendor._id,
      email: "",
      phone: "",
      avatar: vendor.memberAvatar || "",
      password: "",
      dateOfBirth: "",
      verified: false,
      name: {
        firstName: vendor.memberFirstName || vendor.memberNickname || "Vendor",
        lastName: vendor.memberLastName || ""
      }
    },
    email: "",
    name: shopName || "Vendor Store",
    phone: "",
    address: "",
    verified: false,
    coverPicture: "",
    profilePicture: vendor.memberAvatar || "",
    socialLinks: {}
  };
};

const mapSummaryToProduct = (item: ProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail,
    images: [item.thumbnail],
    price,
    discount: toDiscount(price, salePrice),
    rating: 0,
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const mapDetailToProduct = (item: ProductDetail): Product => {
  const price = Number(item.salePrice ?? item.price ?? 0);
  const basePrice = Number(item.price || 0);

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail,
    images: item.images?.length ? item.images : [item.thumbnail],
    price,
    discount: toDiscount(basePrice, item.salePrice),
    rating: 0,
    brand: item.brand,
    description: item.description,
    categories: item.categoryIds || [],
    status: item.status,
    published: item.status === "PUBLISHED",
    shop: mapVendorToShop(item.vendor)
  };
};

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const suggestions = await searchSuggestions({ keyword: slug, limit: 20 });
  const match = (suggestions.list || []).find((item) => item.slug === slug);

  if (!match?._id) return null;

  const detail = await getProductById(match._id);
  if (!detail.product) return null;

  return mapDetailToProduct(detail.product);
}

export async function getRelatedProductsBySlug(slug: string, limit = 8): Promise<Product[]> {
  const suggestions = await searchSuggestions({ keyword: slug, limit: 20 });
  const match = (suggestions.list || []).find((item) => item.slug === slug);

  if (!match?._id) return [];

  const related = await getRelatedProducts({ productId: match._id, limit });
  return (related.list || []).map(mapSummaryToProduct);
}

export async function getFrequentlyBoughtProducts(limit = 8): Promise<Product[]> {
  const featured = await getFeaturedProducts({ limit });
  return (featured.list || []).map(mapSummaryToProduct);
}
