import { cache } from "react";
import type Shop from "models/Shop.model";
import shops from "__server__/__db__/shop/data";
import products from "data/product-database";

const availableShops = [
  {
    name: "Tech Friend",
    imgUrl: "/assets/images/faces/propic.png",
    url: "/shops/scarlett-beauty"
  },
  {
    name: "Smart Shop",
    imgUrl: "/assets/images/faces/propic(1).png",
    url: "/shops/scarlett-beauty"
  },
  {
    name: "Gadget 360",
    imgUrl: "/assets/images/faces/propic(8).png",
    url: "/shops/scarlett-beauty"
  }
];

const getProductsForShop = (slug: string) => {
  return products.filter((item) => item.shop?.slug === slug).slice(0, 9);
};

export const getShopList = cache(async () => {
  const totalShops = shops.length;

  return {
    shops,
    meta: {
      totalShops,
      totalPages: 1,
      firstIndex: totalShops ? 1 : 0,
      lastIndex: totalShops
    }
  };
});

export const getShopSlugs = cache(async () => {
  return shops.map((item) => ({ params: { slug: item.slug } }));
});

export const getProductsBySlug = cache(async (slug: string): Promise<Shop | null> => {
  const foundShop = shops.find((item) => item.slug === slug) || shops[0];
  if (!foundShop) return null;

  return {
    ...foundShop,
    products: getProductsForShop(foundShop.slug)
  };
});

export const getAvailableShops = cache(async () => {
  return availableShops;
});
