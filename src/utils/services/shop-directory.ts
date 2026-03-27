import type Shop from "models/Shop.model";
import type Product from "models/Product.model";
import { getProductById, getProducts } from "../../../libs/product";
import { toPublicImageUrl } from "../../../libs/upload";
import { getPublicApiBaseUrl as getApiBaseUrl } from "../getApiBaseUrl";
import {
  getVendorBySlug,
  getVendorProducts as getVendorProductsApi,
  getVendors,
  type VendorProductsInquiryInput,
  type VendorDetail,
  type VendorProductSummary,
  type VendorSummary
} from "../../../libs/vendor";

const DEFAULT_COVER = "/assets/images/banners/banner-4.png";
const DEFAULT_PROFILE = "/assets/images/faces/face-2.jpg";
const VENDORS_LIMIT = 12;
const CATEGORY_LOOKUP_PRODUCT_LIMIT = 24;
const PRODUCT_LOOKUP_LIMIT = 50;
const MAX_PRODUCT_LOOKUP_PAGES = 20;
const VENDOR_LOOKUP_PAGE_LIMIT = 50;
const MAX_VENDOR_LOOKUP_PAGES = 20;
const MAX_VENDOR_PRODUCT_SEARCH_PAGES = 20;
const DEFAULT_SHOP_PRODUCTS_LIMIT = 24;

const mapShopSort = (sort?: string): "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC" | "POPULAR" => {
  if (sort === "oldest") return "OLDEST";
  if (sort === "az") return "NAME_ASC";
  if (sort === "za") return "NAME_DESC";
  if (sort === "popular") return "POPULAR";
  return "NEWEST";
};

const addVersionQuery = (url: string, version?: string | null) => {
  if (!version) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
};

const resolveVendorImage = (value?: string | null, version?: string | null) => {
  if (!value) return "";

  const normalized = value.replace(/\\/g, "/").trim();
  if (!normalized) return "";

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("blob:")
  ) {
    return addVersionQuery(normalized, version);
  }

  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    const localPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return addVersionQuery(localPath, version);
  }

  return addVersionQuery(toPublicImageUrl(normalized, apiBase), version);
};

const safeImage = (value?: string | null, fallback = DEFAULT_PROFILE, version?: string | null) => {
  const resolved = resolveVendorImage(value, version);
  if (!resolved) return fallback;
  return resolved;
};

const mapProductToUi = (item: VendorProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const discount =
    salePrice && price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const thumbnail =
    resolveVendorImage(item.thumbnail, item.createdAt) || "/assets/images/products/placeholder.png";

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail,
    images: [thumbnail],
    price,
    discount,
    rating: Number(item.ratingAvg || 0),
    reviewsCount: Number(item.reviewsCount || 0),
    likes: Number(item.likes || 0),
    meLiked: Boolean((item as VendorProductSummary & { meLiked?: boolean }).meLiked),
    views: Number(item.views || 0),
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const mapVendorSort = (sort?: string): VendorProductsInquiryInput["sortBy"] => {
  if (sort === "asc") return "PRICE_ASC";
  if (sort === "desc") return "PRICE_DESC";
  if (sort === "popular") return "POPULAR";
  return "NEWEST";
};

const applyLocalVendorSort = (items: VendorProductSummary[], sort?: string) => {
  const sorted = [...items];
  const effectivePrice = (item: VendorProductSummary) =>
    typeof item.salePrice === "number" ? Number(item.salePrice) : Number(item.price || 0);

  if (sort === "asc") {
    return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  }

  if (sort === "desc") {
    return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  }

  if (sort === "popular") {
    return sorted.sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0));
  }

  return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const getVendorDisplayNameFromProduct = async (vendorId: string, productId?: string) => {
  if (!vendorId || !productId) return null;

  const productDetail = await getProductById(productId);
  if (!productDetail.success || !productDetail.product?.vendor) return null;

  const vendor = productDetail.product.vendor;
  if (vendor._id !== vendorId) return null;

  const displayName =
    vendor.memberNickname ||
    `${vendor.memberFirstName || ""} ${vendor.memberLastName || ""}`.trim();

  return displayName || null;
};

type VendorShop = Shop & { products: Product[] };

const mapVendorToShop = (vendor: VendorSummary): VendorShop => {
  const displayName = vendor.storeName || "Vendor";

  return {
    id: vendor._id,
    slug: vendor.slug,
    user: {
      id: vendor._id,
      email: "",
      phone: vendor.memberPhone || "-",
      avatar: safeImage(vendor.memberImage, DEFAULT_PROFILE, vendor.updatedAt),
      password: "",
      dateOfBirth: "",
      verified: vendor.verified,
      name: { firstName: displayName, lastName: "" }
    },
    email: "",
    name: displayName,
    phone: vendor.memberPhone || "-",
    address: vendor.memberAddress || "Address not provided",
    verified: vendor.verified,
    coverPicture: safeImage(vendor.coverImage, DEFAULT_COVER, vendor.updatedAt),
    profilePicture: safeImage(vendor.memberImage, DEFAULT_PROFILE, vendor.updatedAt),
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

const getVendorProducts = async ({
  vendorId,
  page,
  limit,
  sort,
  q
}: {
  vendorId: string;
  page: number;
  limit: number;
  sort?: string;
  q?: string;
}) => {
  const searchQuery = (q || "").trim().toLowerCase();
  const mapItemsToProducts = (items: VendorProductSummary[]) =>
    items.map((item) => mapProductToUi(item));

  if (searchQuery) {
    const allItems: VendorProductSummary[] = [];
    let availablePages = 1;

    for (let currentPage = 1; currentPage <= availablePages; currentPage += 1) {
      const response = await getVendorProductsApi({
        vendorId,
        inquiry: {
          page: currentPage,
          limit,
          sortBy: mapVendorSort(sort)
        }
      });

      if (!response.success) break;

      const list = response.list || [];
      allItems.push(...list);

      const total = response.total || 0;
      availablePages = Math.max(1, Math.ceil(total / limit));
      if (currentPage >= MAX_VENDOR_PRODUCT_SEARCH_PAGES || list.length === 0) break;
    }

    const filteredItems = applyLocalVendorSort(
      allItems.filter((item) => (item.title || "").toLowerCase().includes(searchQuery)),
      sort
    );

    const totalProducts = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
    const pageStart = (page - 1) * limit;
    const pageItems = filteredItems.slice(pageStart, pageStart + limit);
    const products = mapItemsToProducts(pageItems);
    const firstIndex = totalProducts === 0 ? 0 : pageStart + 1;
    const lastIndex = Math.min(page * limit, totalProducts);

    return {
      products,
      meta: {
        totalProducts,
        totalPages,
        firstIndex,
        lastIndex,
        currentPage: page
      }
    };
  }

  const response = await getVendorProductsApi({
    vendorId,
    inquiry: {
      page,
      limit,
      sortBy: mapVendorSort(sort)
    }
  });

  const sortedItems = applyLocalVendorSort(response.list || [], sort);
  const products = mapItemsToProducts(sortedItems);
  const totalProducts = response.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const firstIndex = totalProducts === 0 ? 0 : (page - 1) * limit + 1;
  const lastIndex = Math.min(page * limit, totalProducts);

  return {
    products,
    meta: {
      totalProducts,
      totalPages,
      firstIndex,
      lastIndex,
      currentPage: page
    }
  };
};

const getVendorShopsData = async (
  page: number,
  limit: number,
  search = "",
  sort: string = "newest"
) => {
  const vendorsResponse = await getVendors({
    page,
    limit,
    search,
    status: "ACTIVE",
    sortBy: mapShopSort(sort)
  });

  if (!vendorsResponse.success) {
    console.error("[shops] Failed to fetch vendors:", vendorsResponse.error);
    return { shops: [] as VendorShop[], total: 0 };
  }

  const enrichedVendors = await Promise.all(
    (vendorsResponse.list || []).map(async (vendor) => {
      if (vendor.coverImage) return vendor;

      const bySlug = await getVendorBySlug(vendor.slug);
      if (!bySlug.success || !bySlug.vendor?.coverImage) {
        return vendor;
      }

      return {
        ...vendor,
        coverImage: bySlug.vendor.coverImage
      };
    })
  );

  return {
    shops: enrichedVendors.map(mapVendorToShop),
    total: vendorsResponse.total || 0
  };
};

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

const findVendorBySearch = async (term: string): Promise<VendorSummary | null> => {
  if (!term) return null;

  const statuses: Array<"ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined> = [
    "ACTIVE",
    undefined,
    "INACTIVE",
    "SUSPENDED"
  ];

  for (const status of statuses) {
    const response = await getVendors({
      page: 1,
      limit: 20,
      search: term,
      status,
      sortBy: "NEWEST"
    });

    if (!response.success || !response.list?.length) continue;

    const exactIdMatch = response.list.find((item) => item._id === term);
    if (exactIdMatch) return exactIdMatch;

    const exactSlugMatch = response.list.find((item) => item.slug === term);
    if (exactSlugMatch) return exactSlugMatch;

    return response.list[0];
  }

  return null;
};

export const getShopList = async (page = 1, options?: { q?: string; sort?: string }) => {
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const query = (options?.q || "").trim();
  const sort = options?.sort || "newest";
  const { shops, total } = await getVendorShopsData(currentPage, VENDORS_LIMIT, query, sort);
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
};

export const getShopSlugs = async () => {
  const { shops } = await getVendorShopsData(1, 50, "", "newest");
  return shops.map((item) => ({ params: { slug: item.slug } }));
};

export const getProductsBySlug = async (
  slug: string,
  options?: { page?: number; sort?: string; limit?: number; q?: string }
): Promise<{
  shop: Shop;
  meta: {
    totalProducts: number;
    totalPages: number;
    firstIndex: number;
    lastIndex: number;
    currentPage: number;
  };
} | null> => {
  const page = Number.isFinite(options?.page) && (options?.page || 0) > 0 ? options!.page! : 1;
  const limit =
    Number.isFinite(options?.limit) && (options?.limit || 0) > 0
      ? options!.limit!
      : DEFAULT_SHOP_PRODUCTS_LIMIT;
  const sort = options?.sort;
  const q = options?.q;

  let vendorResponse = await getVendorBySlug(slug);

  // Backward compatibility: some links may still use vendorId instead of vendor slug.
  if ((!vendorResponse.success || !vendorResponse.vendor) && /^[a-f0-9]{24}$/i.test(slug)) {
    // First try direct vendor-id lookup so ID routes still render even if slug resolution misses.
    const vendorById = await findVendorById(slug);
    if (vendorById) {
      let shop = mapVendorToShop(vendorById);

      // Enrich with vendor detail (email/description) when slug exists.
      if (vendorById.slug) {
        const bySlug = await getVendorBySlug(vendorById.slug);
        if (bySlug.success && bySlug.vendor) {
          shop = mapVendorDetailToShop(bySlug.vendor);
        }
      }

      const vendorProducts = await getVendorProducts({ vendorId: shop.id, page, limit, sort, q });
      return {
        shop: { ...shop, products: vendorProducts.products },
        meta: vendorProducts.meta
      };
    }

    const resolvedSlug = await findVendorSlugById(slug);
    if (resolvedSlug) {
      vendorResponse = await getVendorBySlug(resolvedSlug);
    }

    // Final fallback: render vendor page from products even when vendor profile lookup fails.
    if (!vendorResponse.success || !vendorResponse.vendor) {
      const vendorProducts = await getVendorProducts({ vendorId: slug, page, limit, sort, q });
      const products = vendorProducts.products;

      if (products.length > 0) {
        const searchedVendor = await findVendorBySearch(slug);
        const nameFromProduct = await getVendorDisplayNameFromProduct(slug, products[0]?.id);
        const fallbackName = nameFromProduct || searchedVendor?.storeName || "Vendor Store";
        const fallbackSlug = searchedVendor?.slug || slug;

        return {
          shop: {
            id: slug,
            slug: fallbackSlug,
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
          },
          meta: vendorProducts.meta
        };
      }
    }
  }

  if (!vendorResponse.success || !vendorResponse.vendor) return null;

  const shop = mapVendorDetailToShop(vendorResponse.vendor);
  const vendorProducts = await getVendorProducts({ vendorId: shop.id, page, limit, sort, q });

  return {
    shop: { ...shop, products: vendorProducts.products },
    meta: vendorProducts.meta
  };
};

export const getAvailableShops = async () => {
  const { shops } = await getVendorShopsData(1, 3);

  return shops.slice(0, 3).map((item) => ({
    name: item.name,
    imgUrl: item.profilePicture || DEFAULT_PROFILE,
    url: `/shops/${item.slug}`
  }));
};

export const getAvailableShopsByCategory = async (
  categoryId: string,
  excludedVendorId?: string
) => {
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
};
