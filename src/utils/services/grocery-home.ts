import { cache } from "react";
import type Product from "models/Product.model";
import type Service from "models/Service.model";
import type CategoryNavList from "models/CategoryNavList.model";
import { getCategories, getCategoryBySlug } from "../../../libs/category";
import {
  getFeaturedProducts,
  getProducts,
  type ProductSummary,
  type ProductSortBy
} from "../../../libs/product";

const DEFAULT_THUMBNAIL = "/assets/images/products/placeholder.png";
const PRODUCT_PAGE_LIMIT = 24;

type GroceryCategory = {
  slug: string;
  href: string;
  title: string;
};

const FALLBACK_SERVICES: Service[] = [
  {
    id: "grocery-service-fast-delivery",
    icon: "Truck",
    title: "Fast Delivery",
    description: "Fresh groceries delivered quickly to your doorstep."
  },
  {
    id: "grocery-service-quality",
    icon: "Shield",
    title: "Quality Guaranteed",
    description: "Carefully selected produce from trusted suppliers."
  },
  {
    id: "grocery-service-secure-payment",
    icon: "CreditCard",
    title: "Secure Payment",
    description: "Multiple payment options with secure checkout."
  },
  {
    id: "grocery-service-support",
    icon: "CustomerService",
    title: "Always Support",
    description: "Dedicated support team for your grocery shopping needs."
  }
];

const toProductModel = (item: ProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail || DEFAULT_THUMBNAIL,
    images: [item.thumbnail || DEFAULT_THUMBNAIL],
    price,
    discount,
    rating: 0,
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

async function getCatalogProductsForHome(options?: {
  categoryIds?: string[];
  sortBy?: ProductSortBy;
  limit?: number;
}): Promise<Product[]> {
  const response = await getProducts({
    page: 1,
    limit: options?.limit || PRODUCT_PAGE_LIMIT,
    categoryIds: options?.categoryIds,
    sortBy: options?.sortBy
  });

  return (response.list || []).map(toProductModel);
}

export const getGrocery1Navigation = cache(async () => {
  const categoriesResponse = await getCategories({ page: 1, limit: 50, status: "ACTIVE" });

  const categoryItems = (categoriesResponse.list || []).map((item) => ({
    icon: "CategoryOutline",
    title: item.name,
    href: `/grocery-1/${item.slug}`
  }));

  const nav: CategoryNavList[] = [
    {
      category: "Categories",
      categoryItem: categoryItems
    }
  ];

  return nav;
});

export const getPopularProducts = cache(async (): Promise<Product[]> => {
  const response = await getFeaturedProducts({ limit: 12 });
  return (response.list || []).map(toProductModel);
});

export const getTrendingProducts = cache(async (): Promise<Product[]> => {
  return getCatalogProductsForHome({ sortBy: "POPULAR", limit: 12 });
});

export const getGroceryProducts = cache(async (category?: string): Promise<Product[]> => {
  if (!category) {
    return getCatalogProductsForHome({ sortBy: "NEWEST", limit: PRODUCT_PAGE_LIMIT });
  }

  const categoryResponse = await getCategories({
    page: 1,
    limit: 20,
    search: category,
    status: "ACTIVE"
  });

  const categoryIds = (categoryResponse.list || []).map((item) => item._id);
  if (!categoryIds.length) return [];

  return getCatalogProductsForHome({
    categoryIds,
    sortBy: "NEWEST",
    limit: PRODUCT_PAGE_LIMIT
  });
});

export const getGroceryServices = cache(async (): Promise<Service[]> => {
  return FALLBACK_SERVICES;
});

export const getGroceryCategory = cache(
  async (category: string): Promise<{ title: string } | null> => {
    const response = await getCategoryBySlug(category);
    if (!response.success || !response.category) return null;

    const result: GroceryCategory = {
      slug: response.category.slug,
      href: `/grocery-1/${response.category.slug}`,
      title: response.category.name
    };

    return { title: result.title };
  }
);
