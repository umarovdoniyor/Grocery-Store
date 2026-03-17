import type Filters from "models/Filters";
import type Product from "models/Product.model";
import {
  getProducts,
  type ProductSortBy,
  type ProductSummary,
  type CatalogProductsInquiryInput
} from "../../../libs/product";
import { getCategories, getCategoryBySlug } from "../../../libs/category";
import {
  getVendorBySlug,
  getVendorProducts,
  getVendors,
  type VendorProductSummary
} from "../../../libs/vendor";
import { toPublicImageUrl } from "../../../libs/upload";

const DEFAULT_THUMBNAIL = "/assets/images/products/placeholder.png";
const DEFAULT_COLORS = ["#1C1C1C", "#FF7A7A", "#FFC672", "#84FFB5", "#70F6FF", "#6B7AFF"];

const DEFAULT_OTHERS = [
  { label: "On Sale", value: "sale" },
  { label: "In Stock", value: "stock" },
  { label: "Featured", value: "featured" }
];

const mapSort = (sort?: string): ProductSortBy | undefined => {
  if (sort === "date") return "NEWEST";
  if (sort === "asc") return "PRICE_ASC";
  if (sort === "desc") return "PRICE_DESC";
  return undefined;
};

const getApiBaseUrl = () => {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
};

const normalizeThumbnail = (thumbnail?: string | null): string => {
  const value = (thumbnail || "").replace(/\\/g, "/").trim();
  if (!value) return DEFAULT_THUMBNAIL;

  // Some seeded backend entries use non-image placeholder URLs on example.com,
  // which causes Next image optimization to fail with 500.
  if (value.includes("example.com")) return DEFAULT_THUMBNAIL;

  if (value.startsWith("/assets/")) return value;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const parsed = new URL(value);
      return parsed.host ? value : DEFAULT_THUMBNAIL;
    } catch {
      return DEFAULT_THUMBNAIL;
    }
  }

  const apiBase = getApiBaseUrl();
  if (!apiBase) return value.startsWith("/") ? value : `/${value}`;

  return toPublicImageUrl(value, apiBase);
};

const mapProduct = (item: ProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: normalizeThumbnail(item.thumbnail),
    images: [normalizeThumbnail(item.thumbnail)],
    price,
    discount,
    rating: Number(item.ratingAvg || 0),
    reviewsCount: Number(item.reviewsCount || 0),
    likes: Number(item.likes || 0),
    views: Number(item.views || 0),
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const mapVendorProduct = (item: VendorProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: normalizeThumbnail(item.thumbnail),
    images: [normalizeThumbnail(item.thumbnail)],
    price,
    discount,
    rating: Number(item.ratingAvg || 0),
    reviewsCount: Number(item.reviewsCount || 0),
    likes: Number(item.likes || 0),
    views: Number(item.views || 0),
    categories: [],
    status: item.status as Product["status"],
    published: item.status === "PUBLISHED"
  };
};

const toInt = (value?: string, fallback = 1) => {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

export async function getCatalogFilters(): Promise<Filters> {
  const [categoriesRes, vendorsRes] = await Promise.all([
    getCategories({ page: 1, limit: 50, status: "ACTIVE" }),
    getVendors({ page: 1, limit: 50, status: "ACTIVE", sortBy: "POPULAR" })
  ]);

  const categories = (categoriesRes.list || []).map((category) => ({
    title: category.name,
    value: category.slug
  }));

  const brands = (vendorsRes.list || []).map((vendor) => ({
    label: vendor.storeName,
    value: vendor.slug
  }));

  return {
    categories,
    brands,
    others: DEFAULT_OTHERS,
    colors: DEFAULT_COLORS
  };
}

interface CatalogSearchParams {
  q?: string;
  page?: string;
  sort?: string;
  sale?: string;
  sales?: string;
  prices?: string;
  colors?: string;
  brands?: string;
  rating?: string;
  category?: string;
}

const parseJsonStringArray = (value?: string): string[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const parsePriceRange = (value?: string): { minPrice?: number; maxPrice?: number } => {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length !== 2) return {};

    const min = Number(parsed[0]);
    const max = Number(parsed[1]);

    return {
      minPrice: Number.isFinite(min) ? min : undefined,
      maxPrice: Number.isFinite(max) ? max : undefined
    };
  } catch {
    return {};
  }
};

const parseMinRating = (value?: string): number | undefined => {
  const parsed = Number.parseInt(value || "", 10);
  if (Number.isNaN(parsed)) return undefined;
  if (parsed < 1 || parsed > 5) return undefined;
  return parsed;
};

const applyLocalSort = (products: Product[], sort?: string): Product[] => {
  if (sort !== "asc" && sort !== "desc") return products;

  const sorted = [...products].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  return sort === "asc" ? sorted : sorted.reverse();
};

export async function getCatalogProducts(params: CatalogSearchParams) {
  const page = toInt(params.page, 1);
  const limit = 10;
  const selectedSales = parseJsonStringArray(params.sales);
  const selectedBrands = parseJsonStringArray(params.brands);
  const selectedShopSlug = selectedBrands[0] || params.brands || undefined;
  const minRating = parseMinRating(params.rating);
  const { minPrice, maxPrice } = parsePriceRange(params.prices);
  const inStock = params.sale === "stock" || selectedSales.includes("stock") ? true : undefined;
  const backendSort = mapSort(params.sort);

  if (selectedShopSlug) {
    const vendorResponse = await getVendorBySlug(selectedShopSlug);

    if (!vendorResponse.success || !vendorResponse.vendor?._id) {
      return {
        products: [],
        pageCount: 1,
        totalProducts: 0,
        firstIndex: 0,
        lastIndex: 0
      };
    }

    const vendorProducts = await getVendorProducts({
      vendorId: vendorResponse.vendor._id,
      inquiry: {
        page,
        limit,
        sortBy: backendSort
      }
    });

    const products = applyLocalSort((vendorProducts.list || []).map(mapVendorProduct), params.sort);
    const totalProducts = vendorProducts.total || 0;
    const pageCount = Math.max(1, Math.ceil(totalProducts / limit));
    const firstIndex = totalProducts === 0 ? 0 : (page - 1) * limit + 1;
    const lastIndex = Math.min(page * limit, totalProducts);

    return {
      products,
      pageCount,
      totalProducts,
      firstIndex,
      lastIndex
    };
  }

  const input: CatalogProductsInquiryInput = {
    page,
    limit,
    search: params.q || undefined,
    sortBy: backendSort,
    inStock,
    brand: undefined,
    minRating,
    minPrice,
    maxPrice
  };

  if (params.category) {
    const bySlug = await getCategoryBySlug(params.category);
    const matchedIds = bySlug.success && bySlug.category ? [bySlug.category._id] : [];

    if (!matchedIds.length) {
      const categoryRes = await getCategories({ page: 1, limit: 20, search: params.category });
      matchedIds.push(...(categoryRes.list || []).map((item) => item._id));
    }

    if (matchedIds.length) {
      input.categoryIds = matchedIds;
    }
  }

  const result = await getProducts(input);
  const products = applyLocalSort((result.list || []).map(mapProduct), params.sort);
  const totalProducts = result.total || 0;
  const pageCount = Math.max(1, Math.ceil(totalProducts / limit));
  const firstIndex = totalProducts === 0 ? 0 : (page - 1) * limit + 1;
  const lastIndex = Math.min(page * limit, totalProducts);

  return {
    products,
    pageCount,
    totalProducts,
    firstIndex,
    lastIndex
  };
}
