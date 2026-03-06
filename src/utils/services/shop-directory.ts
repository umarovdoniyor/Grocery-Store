import { cache } from "react";
import type Shop from "models/Shop.model";
import type Product from "models/Product.model";
import {
  getVendorBySlug,
  getVendorProducts as getVendorProductsApi,
  getVendors,
  type VendorDetail,
  type VendorProductSummary,
  type VendorSummary
} from "../../../libs/vendor";

const DEFAULT_COVER = "/assets/images/banners/cycle.png";
const DEFAULT_PROFILE = "/assets/images/faces/propic.png";
const VENDORS_LIMIT = 100;

const safeImage = (value?: string | null, fallback = DEFAULT_PROFILE) => {
  if (!value) return fallback;
  return value;
};

const mapProductToUi = (item: VendorProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail || "/assets/images/products/placeholder.png",
    images: [item.thumbnail || "/assets/images/products/placeholder.png"],
    price,
    discount,
    rating: 0,
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

type VendorShop = Shop & { products: Product[] };

const mapVendorToShop = (vendor: VendorSummary): VendorShop => {
  const displayName = vendor.storeName || "Vendor";

  return {
    id: vendor._id,
    slug: vendor.slug,
    user: {
      id: vendor._id,
      email: `${vendor.slug}@vendor.local`,
      phone: vendor.memberPhone || "-",
      avatar: safeImage(vendor.memberImage, DEFAULT_PROFILE),
      password: "",
      dateOfBirth: "",
      verified: vendor.verified,
      name: { firstName: displayName, lastName: "" }
    },
    email: `${vendor.slug}@vendor.local`,
    name: displayName,
    phone: vendor.memberPhone || "-",
    address: vendor.memberAddress || "Address not provided",
    verified: vendor.verified,
    coverPicture: safeImage(vendor.coverImage, DEFAULT_COVER),
    profilePicture: safeImage(vendor.memberImage, DEFAULT_PROFILE),
    socialLinks: {
      facebook: null,
      youtube: null,
      twitter: null,
      instagram: null
    },
    products: []
  };
};

const mapVendorDetailToShop = (vendor: VendorDetail): VendorShop => {
  const base = mapVendorToShop(vendor);

  return {
    ...base,
    email: vendor.memberEmail || base.email,
    user: {
      ...base.user,
      email: vendor.memberEmail || base.user.email
    }
  };
};

const getVendorProducts = cache(async (vendorId: string): Promise<Product[]> => {
  const response = await getVendorProductsApi({
    vendorId,
    inquiry: {
      page: 1,
      limit: 24,
      sortBy: "NEWEST"
    }
  });

  return (response.list || []).map(mapProductToUi);
});

const getVendorShopsData = cache(async (): Promise<VendorShop[]> => {
  const vendorsResponse = await getVendors({
    page: 1,
    limit: VENDORS_LIMIT,
    search: "",
    status: "ACTIVE",
    sortBy: "NEWEST"
  });

  return (vendorsResponse.list || []).map(mapVendorToShop);
});

export const getShopList = cache(async () => {
  const shops = await getVendorShopsData();
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
  const shops = await getVendorShopsData();
  return shops.map((item) => ({ params: { slug: item.slug } }));
});

export const getProductsBySlug = cache(async (slug: string): Promise<Shop | null> => {
  const vendorResponse = await getVendorBySlug(slug);
  if (!vendorResponse.success || !vendorResponse.vendor) return null;

  const shop = mapVendorDetailToShop(vendorResponse.vendor);
  const products = await getVendorProducts(shop.id);

  return { ...shop, products };
});

export const getAvailableShops = cache(async () => {
  const shops = await getVendorShopsData();

  return shops.slice(0, 3).map((item) => ({
    name: item.name,
    imgUrl: item.profilePicture || DEFAULT_PROFILE,
    url: `/shops/${item.slug}`
  }));
});
