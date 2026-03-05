import { cache } from "react";
import shuffle from "lodash/shuffle";
import type Product from "models/Product.model";
import type Service from "models/Service.model";
import { products, serviceList, categoryNavigation } from "__server__/__db__/grocery-1/data";

const getProductsByType = (type: string): Product[] => {
  return products.filter((item) => item.for.type === type) as unknown as Product[];
};

type GroceryCategory = {
  href: string;
  title: string;
};

const categories = categoryNavigation.flatMap(({ categoryItem }) =>
  categoryItem.flatMap((item) => ("child" in item && item.child ? item.child : item))
) as GroceryCategory[];

export const getGrocery1Navigation = cache(async () => {
  return categoryNavigation;
});

export const getPopularProducts = cache(async (): Promise<Product[]> => {
  return getProductsByType("popular-products");
});

export const getTrendingProducts = cache(async (): Promise<Product[]> => {
  return getProductsByType("trending-products");
});

export const getGroceryProducts = cache(async (category?: string): Promise<Product[]> => {
  const allProducts = getProductsByType("all-products");
  if (category) return shuffle(allProducts);
  return allProducts;
});

export const getGroceryServices = cache(async (): Promise<Service[]> => {
  return serviceList as unknown as Service[];
});

export const getGroceryCategory = cache(
  async (category: string): Promise<{ title: string } | null> => {
    const matchedCategory = categories.find((item) => item.href === `/grocery-1/${category}`);
    return matchedCategory || null;
  }
);
