import { cache } from "react";
import type Shop from "models/Shop.model";
import type Product from "models/Product.model";
import { getProductById, getProducts } from "../../../libs/product";
import {
  getVendorBySlug,
  getVendorProducts as getVendorProductsApi,
  getVendors,
  type VendorDetail,
  type VendorProductSummary,
  type VendorSummary
} from "../../../libs/vendor";

const DEFAULT_COVER = "/assets/images/banners/banner-4.png";
const DEFAULT_PROFILE = "/assets/images/faces/face-2.jpg";
const VENDORS_LIMIT = 12;
const CATEGORY_LOOKUP_PRODUCT_LIMIT = 24;
const VENDOR_LOOKUP_PAGE_LIMIT = 100;
const MAX_VENDOR_LOOKUP_PAGES = 20;

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

const getVendorShopsData = cache(async (page: number, limit: number) => {
  const vendorsResponse = await getVendors({
    page,
    limit,
    search: "",
    status: "ACTIVE",
    sortBy: "NEWEST"
  });

  if (!vendorsResponse.success) {
    console.error("[shops] Failed to fetch vendors:", vendorsResponse.error);
    return { shops: [] as VendorShop[], total: 0 };
  }

  return {
    shops: (vendorsResponse.list || []).map(mapVendorToShop),
    total: vendorsResponse.total || 0
  };
});

const findVendorSlugById = async (vendorId: string): Promise<string | null> => {
  if (!vendorId) return null;

  const statuses: Array<"ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined> = [
    "ACTIVE",
    undefined,
    "INACTIVE",
    "SUSPENDED"
  ];

  for (const status of statuses) {
    const firstPage = await getVendors({
      page: 1,
      limit: VENDOR_LOOKUP_PAGE_LIMIT,
      search: "",
      status,
      sortBy: "NEWEST"
    });

    if (!firstPage.success) continue;

    const firstMatch = (firstPage.list || []).find((item) => item._id === vendorId);
    if (firstMatch?.slug) return firstMatch.slug;

    const total = firstPage.total || 0;
    const totalPages = Math.min(
      Math.max(1, Math.ceil(total / VENDOR_LOOKUP_PAGE_LIMIT)),
      MAX_VENDOR_LOOKUP_PAGES
    );

    for (let page = 2; page <= totalPages; page += 1) {
      const response = await getVendors({
        page,
        limit: VENDOR_LOOKUP_PAGE_LIMIT,
        search: "",
        status,
        sortBy: "NEWEST"
      });

      if (!response.success) continue;

      const match = (response.list || []).find((item) => item._id === vendorId);
      if (match?.slug) return match.slug;
    }
  }

  return null;
};

const findVendorById = async (vendorId: string): Promise<VendorSummary | null> => {
  if (!vendorId) return null;

  const statuses: Array<"ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined> = [
    "ACTIVE",
    undefined,
    "INACTIVE",
    "SUSPENDED"
  ];

  for (const status of statuses) {
    const firstPage = await getVendors({
      page: 1,
      limit: VENDOR_LOOKUP_PAGE_LIMIT,
      search: "",
      status,
      sortBy: "NEWEST"
    });

    if (!firstPage.success) continue;

    const firstMatch = (firstPage.list || []).find((item) => item._id === vendorId);
    if (firstMatch) return firstMatch;

    const total = firstPage.total || 0;
    const totalPages = Math.min(
      Math.max(1, Math.ceil(total / VENDOR_LOOKUP_PAGE_LIMIT)),
      MAX_VENDOR_LOOKUP_PAGES
    );

    for (let page = 2; page <= totalPages; page += 1) {
      const response = await getVendors({
        page,
        limit: VENDOR_LOOKUP_PAGE_LIMIT,
        search: "",
        status,
        sortBy: "NEWEST"
      });

      if (!response.success) continue;

      const match = (response.list || []).find((item) => item._id === vendorId);
      if (match) return match;
    }
  }

  return null;
};

export const getShopList = cache(async (page = 1) => {
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const { shops, total } = await getVendorShopsData(currentPage, VENDORS_LIMIT);
  const totalShops = total;
  const totalPages = Math.max(1, Math.ceil(totalShops / VENDORS_LIMIT));
  const firstIndex = shops.length ? (currentPage - 1) * VENDORS_LIMIT + 1 : 0;
  const lastIndex = shops.length ? firstIndex + shops.length - 1 : 0;

  return {
    shops,
    meta: {
      totalShops,
      totalPages,
      firstIndex,
      lastIndex
    }
  };
});

export const getShopSlugs = cache(async () => {
  const { shops } = await getVendorShopsData(1, 50);
  return shops.map((item) => ({ params: { slug: item.slug } }));
});

export const getProductsBySlug = async (slug: string): Promise<Shop | null> => {
  let vendorResponse = await getVendorBySlug(slug);

  // Backward compatibility: some links may still use vendorId instead of vendor slug.
  if ((!vendorResponse.success || !vendorResponse.vendor) && /^[a-f0-9]{24}$/i.test(slug)) {
    // First try direct vendor-id lookup so ID routes still render even if slug resolution misses.
    const vendorById = await findVendorById(slug);
    if (vendorById) {
      const shop = mapVendorToShop(vendorById);
      const products = await getVendorProducts(shop.id);
      return { ...shop, products };
    }

    const resolvedSlug = await findVendorSlugById(slug);
    if (resolvedSlug) {
      vendorResponse = await getVendorBySlug(resolvedSlug);
    }

    // Final fallback: render vendor page from products even when vendor profile lookup fails.
    if (!vendorResponse.success || !vendorResponse.vendor) {
      const products = await getVendorProducts(slug);

      if (products.length > 0) {
        const fallbackName = products[0]?.title ? `Vendor ${slug.slice(-6)}` : "Vendor Store";

        return {
          id: slug,
          slug,
          user: {
            id: slug,
            email: "",
            phone: "-",
            avatar: DEFAULT_PROFILE,
            password: "",
            dateOfBirth: "",
            verified: false,
            name: { firstName: fallbackName, lastName: "" }
          },
          email: "",
          name: fallbackName,
          phone: "-",
          address: "Address not provided",
          verified: false,
          coverPicture: DEFAULT_COVER,
          profilePicture: DEFAULT_PROFILE,
          socialLinks: {
            facebook: null,
            youtube: null,
            twitter: null,
            instagram: null
          },
          products
        };
      }
    }
  }

  if (!vendorResponse.success || !vendorResponse.vendor) return null;

  const shop = mapVendorDetailToShop(vendorResponse.vendor);
  const products = await getVendorProducts(shop.id);

  return { ...shop, products };
};

export const getAvailableShops = cache(async () => {
  const { shops } = await getVendorShopsData(1, 3);

  return shops.slice(0, 3).map((item) => ({
    name: item.name,
    imgUrl: item.profilePicture || DEFAULT_PROFILE,
    url: `/shops/${item.slug}`
  }));
});

export const getAvailableShopsByCategory = cache(
  async (categoryId: string, excludedVendorId?: string) => {
    if (!categoryId) return [];

    const productsResponse = await getProducts({
      page: 1,
      limit: CATEGORY_LOOKUP_PRODUCT_LIMIT,
      categoryIds: [categoryId],
      sortBy: "POPULAR"
    });

    if (!productsResponse.success || !productsResponse.list?.length) return [];

    const detailResults = await Promise.allSettled(
      productsResponse.list.map((product) => getProductById(product._id))
    );

    const vendorIds = new Set<string>();

    detailResults.forEach((result) => {
      if (result.status !== "fulfilled") return;

      const vendorId = result.value.product?.vendor?._id;
      if (!vendorId) return;
      if (excludedVendorId && vendorId === excludedVendorId) return;

      vendorIds.add(vendorId);
    });

    if (vendorIds.size === 0) return [];

    const vendorsResponse = await getVendors({
      page: 1,
      limit: 50,
      search: "",
      status: "ACTIVE",
      sortBy: "POPULAR"
    });

    if (!vendorsResponse.success || !vendorsResponse.list?.length) return [];

    const vendorMap = new Map(vendorsResponse.list.map((vendor) => [vendor._id, vendor]));

    return Array.from(vendorIds)
      .map((vendorId) => vendorMap.get(vendorId))
      .filter((vendor): vendor is NonNullable<typeof vendor> => Boolean(vendor))
      .slice(0, 4)
      .map((vendor) => ({
        name: vendor.storeName,
        imgUrl: safeImage(vendor.memberImage, DEFAULT_PROFILE),
        url: `/shops/${vendor.slug}`
      }));
  }
);
