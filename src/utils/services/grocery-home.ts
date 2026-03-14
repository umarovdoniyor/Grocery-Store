import { cache } from "react";
import type Product from "models/Product.model";
import type Service from "models/Service.model";
import type CategoryNavList from "models/CategoryNavList.model";
import { getCategories, getCategoryBySlug, getCategoryTree } from "../../../libs/category";
import {
  getPopularProducts as getPopularProductsApi,
  getTrendingProducts as getTrendingProductsApi,
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

type TreeCategory = {
  _id: string;
  slug: string;
  children?: TreeCategory[];
};

function collectNodeAndDescendantIds(node: TreeCategory): string[] {
  const ids = [node._id];

  (node.children || []).forEach((child) => {
    ids.push(...collectNodeAndDescendantIds(child));
  });

  return ids;
}

function findNodeBySlug(nodes: TreeCategory[], slug: string): TreeCategory | null {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    const found = findNodeBySlug(node.children || [], slug);
    if (found) return found;
  }

  return null;
}

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
    rating: Number(item.ratingAvg || 0),
    reviewsCount: Number(item.reviewsCount || 0),
    likes: Number(item.likes || 0),
    views: Number(item.views || 0),
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
  const treeResponse = await getCategoryTree();

  if (treeResponse.success && treeResponse.tree?.length) {
    const categoryItems = treeResponse.tree.map((parent) => ({
      icon: parent.icon || undefined,
      image: parent.image || undefined,
      title: parent.name,
      href: `/grocery-1/${parent.slug}`,
      child: (parent.children || []).map((child) => ({
        title: child.name,
        href: `/grocery-1/${child.slug}`,
        icon: child.icon || undefined,
        image: child.image || undefined
      }))
    }));

    return [
      {
        category: "Categories",
        categoryItem: categoryItems
      }
    ];
  }

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
  const response = await getPopularProductsApi({ limit: 12 });
  return (response.list || []).map(toProductModel);
});

export const getTrendingProducts = cache(async (): Promise<Product[]> => {
  const response = await getTrendingProductsApi({ limit: 12, windowDays: 7 });
  return (response.list || []).map(toProductModel);
});

export const getGroceryProducts = cache(async (category?: string): Promise<Product[]> => {
  if (!category) {
    return getCatalogProductsForHome({ sortBy: "NEWEST", limit: PRODUCT_PAGE_LIMIT });
  }

  let categoryIds: string[] = [];

  const treeResponse = await getCategoryTree();
  if (treeResponse.success && treeResponse.tree?.length) {
    const matchedNode = findNodeBySlug(treeResponse.tree as TreeCategory[], category);
    if (matchedNode) {
      categoryIds = collectNodeAndDescendantIds(matchedNode);
    }
  }

  if (!categoryIds.length) {
    const selectedCategory = await getCategoryBySlug(category);
    if (!selectedCategory.success || !selectedCategory.category) {
      return [];
    }

    categoryIds = [selectedCategory.category._id];
  }

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
  async (category: string): Promise<{ title: string; slug: string } | null> => {
    const response = await getCategoryBySlug(category);
    if (!response.success || !response.category) return null;

    const result: GroceryCategory = {
      slug: response.category.slug,
      href: `/grocery-1/${response.category.slug}`,
      title: response.category.name
    };

    return { title: result.title, slug: result.slug };
  }
);
