import { cache } from "react";
import type Product from "models/Product.model";
import type Service from "models/Service.model";
import type CategoryNavList from "models/CategoryNavList.model";
import { getCategories, getCategoryBySlug, getCategoryTree } from "../../../libs/category";
import {
  getFeaturedProducts as getFeaturedProductsApi,
  getProductById,
  getPopularProducts as getPopularProductsApi,
  getTrendingProducts as getTrendingProductsApi,
  getProducts,
  type ProductDetail,
  type ProductSummary,
  type ProductSortBy
} from "../../../libs/product";

const DEFAULT_THUMBNAIL = "/assets/images/products/placeholder.png";
const PRODUCT_PAGE_LIMIT = 24;

type GroceryCategory = {
  slug: string;
  href: string;
  title: string;
  parent?: { title: string; slug: string } | null;
};

type TreeCategory = {
  _id: string;
  name?: string;
  slug: string;
  parentId?: string | null;
  children?: TreeCategory[];
};

const CHILD_CATEGORY_KEYWORDS: Record<string, string[]> = {
  "fruits-berries": ["berry", "berries", "strawberry", "strawberries", "blueberry", "blueberries"],
  "fruits-citrus": [
    "citrus",
    "orange",
    "oranges",
    "lemon",
    "lemons",
    "lime",
    "limes",
    "grapefruit"
  ],
  "fruits-tropical fruits": [
    "tropical",
    "mango",
    "mangoes",
    "pineapple",
    "pineapples",
    "papaya",
    "papayas",
    "coconut",
    "coconuts"
  ],
  "vegetables-leafy greens": [
    "leafy",
    "greens",
    "spinach",
    "lettuce",
    "kale",
    "cabbage",
    "arugula",
    "bok choy",
    "chard"
  ],
  "vegetables-root vegetables": [
    "root",
    "carrot",
    "carrots",
    "potato",
    "potatoes",
    "beet",
    "beets",
    "radish",
    "radishes",
    "turnip",
    "turnips",
    "yam",
    "yams",
    "sweet potato",
    "sweet potatoes",
    "onion",
    "onions",
    "garlic",
    "ginger"
  ],
  "organic / specialty-organic fruits": [
    "organic",
    "fruit",
    "fruits",
    "apple",
    "apples",
    "banana",
    "bananas",
    "berry",
    "berries",
    "blueberry",
    "blueberries",
    "avocado",
    "avocados"
  ],
  "organic / specialty-organic vegetables": [
    "organic",
    "vegetable",
    "vegetables",
    "spinach",
    "carrot",
    "carrots",
    "lettuce",
    "kale",
    "broccoli",
    "cucumber",
    "tomato",
    "tomatoes"
  ]
};

const decodeSlug = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeSlug = (value: string) => decodeSlug(value).trim().toLowerCase();

const getSlugCandidates = (value: string) => {
  const normalized = normalizeSlug(value);
  const fromSpaces = normalized.replace(/\s+/g, "-");
  const fromHyphens = normalized.replace(/-/g, " ");

  return Array.from(new Set([normalized, fromSpaces, fromHyphens]));
};

const normalizeText = (value: string) =>
  decodeSlug(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokenizeText = (value: string) => normalizeText(value).split(/\s+/).filter(Boolean);

function collectNodeAndDescendantIds(node: TreeCategory): string[] {
  const ids = [node._id];

  (node.children || []).forEach((child) => {
    ids.push(...collectNodeAndDescendantIds(child));
  });

  return ids;
}

function findNodeBySlug(nodes: TreeCategory[], slug: string): TreeCategory | null {
  const candidates = new Set(getSlugCandidates(slug));

  for (const node of nodes) {
    const nodeCandidates = getSlugCandidates(node.slug);
    if (nodeCandidates.some((item) => candidates.has(item))) return node;

    const found = findNodeBySlug(node.children || [], slug);
    if (found) return found;
  }

  return null;
}

function findNodeById(nodes: TreeCategory[], id: string): TreeCategory | null {
  for (const node of nodes) {
    if (node._id === id) return node;
    const found = findNodeById(node.children || [], id);
    if (found) return found;
  }

  return null;
}

async function getCategoryBySlugFlexible(slug: string) {
  const candidates = getSlugCandidates(slug);

  for (const candidate of candidates) {
    const response = await getCategoryBySlug(candidate);
    if (response.success && response.category) return response.category;
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

const toDetailedProductModel = (item: ProductDetail): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail || DEFAULT_THUMBNAIL,
    images: item.images?.length ? item.images : [item.thumbnail || DEFAULT_THUMBNAIL],
    price,
    discount,
    rating: 0,
    reviewsCount: 0,
    likes: Number(item.likes || 0),
    views: Number(item.views || 0),
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const buildChildCategoryKeywords = (node: TreeCategory, parentNode?: TreeCategory | null) => {
  const parentTokens = new Set(
    parentNode ? [...tokenizeText(parentNode.name || ""), ...tokenizeText(parentNode.slug)] : []
  );

  const ownTokens = [...tokenizeText(node.name || ""), ...tokenizeText(node.slug)].filter(
    (token) => token.length > 2 && !parentTokens.has(token)
  );

  const explicitKeywords = CHILD_CATEGORY_KEYWORDS[normalizeSlug(node.slug)] || [];

  return Array.from(new Set([...ownTokens, ...explicitKeywords]));
};

const matchesChildCategoryFallback = (
  product: ProductDetail,
  childNode: TreeCategory,
  parentNode?: TreeCategory | null
) => {
  const haystack = normalizeText([product.title, product.slug, ...(product.tags || [])].join(" "));
  const categoryPhrase = normalizeText(childNode.name || childNode.slug);
  const keywords = buildChildCategoryKeywords(childNode, parentNode);

  if (categoryPhrase.includes(" ") && haystack.includes(categoryPhrase)) {
    return true;
  }

  return keywords.some((keyword) => haystack.includes(normalizeText(keyword)));
};

async function getChildCategoryFallbackProducts(
  childNode: TreeCategory,
  parentNode: TreeCategory
): Promise<Product[]> {
  const response = await getProducts({
    page: 1,
    limit: 100,
    categoryIds: [parentNode._id],
    sortBy: "NEWEST"
  });

  const parentProducts = response.list || [];
  if (!parentProducts.length) return [];

  const detailResponses = await Promise.all(parentProducts.map((item) => getProductById(item._id)));

  return detailResponses
    .map((entry) => entry.product)
    .filter((item): item is ProductDetail => Boolean(item))
    .filter((item) => matchesChildCategoryFallback(item, childNode, parentNode))
    .slice(0, PRODUCT_PAGE_LIMIT)
    .map(toDetailedProductModel);
}

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
      href: `/grocery-1/${parent.slug}#products`,
      child: (parent.children || []).map((child) => ({
        title: child.name,
        href: `/grocery-1/${child.slug}#products`,
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
    href: `/grocery-1/${item.slug}#products`
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

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const response = await getFeaturedProductsApi({ limit: 12 });

  const sortedFeatured = [...(response.list || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return sortedFeatured.map(toProductModel);
});

export const getTrendingProducts = cache(async (): Promise<Product[]> => {
  const response = await getTrendingProductsApi({ limit: 12, windowDays: 7 });
  return (response.list || []).map(toProductModel);
});

export const getGroceryProducts = cache(async (category?: string): Promise<Product[]> => {
  if (!category) {
    return getCatalogProductsForHome({ sortBy: "NEWEST", limit: PRODUCT_PAGE_LIMIT });
  }

  const normalizedCategorySlug = normalizeSlug(category);
  let matchedNode: TreeCategory | null = null;
  let treeNodes: TreeCategory[] = [];

  const treeResponse = await getCategoryTree();
  if (treeResponse.success && treeResponse.tree?.length) {
    treeNodes = treeResponse.tree as TreeCategory[];
    matchedNode = findNodeBySlug(treeNodes, normalizedCategorySlug);
    if (matchedNode?.parentId) {
      const exactChildProducts = await getCatalogProductsForHome({
        categoryIds: [matchedNode._id],
        sortBy: "NEWEST",
        limit: PRODUCT_PAGE_LIMIT
      });

      if (exactChildProducts.length) {
        return exactChildProducts;
      }

      const parentNode = findNodeById(treeNodes, matchedNode.parentId);
      if (parentNode) {
        const fallbackProducts = await getChildCategoryFallbackProducts(matchedNode, parentNode);
        if (fallbackProducts.length) {
          return fallbackProducts;
        }
      }

      return [];
    }

    if (matchedNode) {
      return getCatalogProductsForHome({
        categoryIds: collectNodeAndDescendantIds(matchedNode),
        sortBy: "NEWEST",
        limit: PRODUCT_PAGE_LIMIT
      });
    }
  }

  const selectedCategory = await getCategoryBySlugFlexible(normalizedCategorySlug);
  if (!selectedCategory) {
    return [];
  }

  return getCatalogProductsForHome({
    categoryIds: [selectedCategory._id],
    sortBy: "NEWEST",
    limit: PRODUCT_PAGE_LIMIT
  });
});

export const getGroceryServices = cache(async (): Promise<Service[]> => {
  return FALLBACK_SERVICES;
});

export const getGroceryCategory = cache(
  async (
    category: string
  ): Promise<{
    title: string;
    slug: string;
    parent?: { title: string; slug: string } | null;
  } | null> => {
    const response = await getCategoryBySlugFlexible(category);
    if (!response) return null;

    let parent: { title: string; slug: string } | null = null;
    if (response.parentId) {
      const treeResponse = await getCategoryTree();
      if (treeResponse.success && treeResponse.tree?.length) {
        const parentNode = findNodeById(treeResponse.tree as TreeCategory[], response.parentId);
        if (parentNode?.name) {
          parent = { title: parentNode.name, slug: parentNode.slug };
        }
      }
    }

    const result: GroceryCategory = {
      slug: response.slug,
      href: `/grocery-1/${response.slug}`,
      title: response.name,
      parent
    };

    return { title: result.title, slug: result.slug, parent: result.parent || null };
  }
);
