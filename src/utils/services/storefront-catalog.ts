import type Filters from "models/Filters";
import type Product from "models/Product.model";
import {
  getProducts,
  type ProductSortBy,
  type ProductSummary,
  type CatalogProductsInquiryInput
} from "../../../libs/product";
import { getCategories } from "../../../libs/category";

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

const mapProduct = (item: ProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail,
    images: [item.thumbnail],
    price,
    discount,
    rating: 0,
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const toInt = (value?: string, fallback = 1) => {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

export async function getCatalogFilters(): Promise<Filters> {
  const categoriesRes = await getCategories({ page: 1, limit: 50, status: "ACTIVE" });

  const categories = (categoriesRes.list || []).map((category) => ({ title: category.name }));

  return {
    categories,
    brands: [],
    others: DEFAULT_OTHERS,
    colors: DEFAULT_COLORS
  };
}

interface CatalogSearchParams {
  q?: string;
  page?: string;
  sort?: string;
  sale?: string;
  prices?: string;
  colors?: string;
  brands?: string;
  rating?: string;
  category?: string;
}

export async function getCatalogProducts(params: CatalogSearchParams) {
  const page = toInt(params.page, 1);
  const limit = 10;

  const input: CatalogProductsInquiryInput = {
    page,
    limit,
    search: params.q || undefined,
    sortBy: mapSort(params.sort),
    inStock: params.sale === "stock" ? true : undefined,
    brand: params.brands || undefined
  };

  if (params.category) {
    const categoryRes = await getCategories({ page: 1, limit: 20, search: params.category });
    const matchedIds = (categoryRes.list || []).map((item) => item._id);
    if (matchedIds.length) {
      input.categoryIds = matchedIds;
    }
  }

  const result = await getProducts(input);
  const products = (result.list || []).map(mapProduct);
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
