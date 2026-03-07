import type Product from "models/Product.model";
import type Review from "models/Review.model";
import type Shop from "models/Shop.model";
import {
  getFeaturedProducts,
  getProductById,
  getProducts,
  getRelatedProducts,
  type ProductDetail,
  type ProductSummary
} from "../../../libs/product";
import { getCategoryById } from "../../../libs/category";
import { getVendors } from "../../../libs/vendor";
import { getProductReviews, type ProductReview as ProductReviewDto } from "../../../libs/review";

const PRODUCT_LOOKUP_LIMIT = 50;
const MAX_PRODUCT_LOOKUP_PAGES = 20;
const PRODUCT_REVIEW_LIMIT = 10;
const VENDOR_LOOKUP_LIMIT = 100;
const MAX_VENDOR_LOOKUP_PAGES = 20;
const DEFAULT_THUMBNAIL = "/assets/images/products/placeholder.png";

const toDiscount = (price: number, salePrice?: number) => {
  if (!salePrice || price <= salePrice || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const normalizeThumbnail = (thumbnail?: string | null): string => {
  const value = (thumbnail || "").trim();
  if (!value) return DEFAULT_THUMBNAIL;
  if (value.includes("example.com")) return DEFAULT_THUMBNAIL;
  return value;
};

const mapVendorToShop = (
  vendor?: (ProductDetail["vendor"] & { slug?: string }) | null
): Shop | undefined => {
  if (!vendor?._id) return undefined;

  const shopName =
    vendor.memberNickname ||
    `${vendor.memberFirstName || ""} ${vendor.memberLastName || ""}`.trim();

  return {
    id: vendor._id,
    slug: vendor.slug || vendor._id,
    user: {
      id: vendor._id,
      email: "",
      phone: "",
      avatar: vendor.memberAvatar || "",
      password: "",
      dateOfBirth: "",
      verified: false,
      name: {
        firstName: vendor.memberFirstName || vendor.memberNickname || "Vendor",
        lastName: vendor.memberLastName || ""
      }
    },
    email: "",
    name: shopName || "Vendor Store",
    phone: "",
    address: "",
    verified: false,
    coverPicture: "",
    profilePicture: vendor.memberAvatar || "",
    socialLinks: {}
  };
};

const mapSummaryToProduct = (item: ProductSummary): Product => {
  const price = Number(item.price || 0);
  const salePrice = typeof item.salePrice === "number" ? item.salePrice : undefined;
  const thumbnail = normalizeThumbnail(item.thumbnail);

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail,
    images: [thumbnail],
    price,
    discount: toDiscount(price, salePrice),
    rating: Number(item.ratingAvg || 0),
    reviewsCount: Number(item.reviewsCount || 0),
    reviews: [],
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const mapDetailToProduct = (item: ProductDetail): Product => {
  const price = Number(item.salePrice ?? item.price ?? 0);
  const basePrice = Number(item.price || 0);
  const thumbnail = normalizeThumbnail(item.thumbnail);
  const normalizedImages =
    item.images?.length > 0 ? item.images.map((image) => normalizeThumbnail(image)) : [thumbnail];

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail,
    images: normalizedImages,
    price,
    discount: toDiscount(basePrice, item.salePrice),
    rating: 0,
    reviews: [],
    brand: item.brand,
    sku: item.sku,
    description: item.description,
    categories: item.categoryIds || [],
    categoryIds: item.categoryIds || [],
    status: item.status,
    published: item.status === "PUBLISHED",
    shop: mapVendorToShop(item.vendor)
  };
};

const resolveCategoryNames = async (categoryIds: string[]): Promise<string[]> => {
  const ids = (categoryIds || []).filter(Boolean);
  if (ids.length === 0) return [];

  const results = await Promise.allSettled(ids.map((id) => getCategoryById(id)));

  return results
    .map((result) => {
      if (result.status !== "fulfilled") return null;
      if (!result.value.success || !result.value.category?.name) return null;
      return result.value.category.name;
    })
    .filter((name): name is string => Boolean(name));
};

const resolveVendorSlug = async (vendorId?: string): Promise<string | undefined> => {
  if (!vendorId) return undefined;

  const statuses: Array<"ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined> = [
    "ACTIVE",
    undefined,
    "INACTIVE",
    "SUSPENDED"
  ];

  for (const status of statuses) {
    const firstPage = await getVendors({
      page: 1,
      limit: VENDOR_LOOKUP_LIMIT,
      search: "",
      status,
      sortBy: "POPULAR"
    });

    if (!firstPage.success) continue;

    const firstMatch = (firstPage.list || []).find((vendor) => vendor._id === vendorId);
    if (firstMatch?.slug) return firstMatch.slug;

    const total = firstPage.total || 0;
    const totalPages = Math.min(
      Math.max(1, Math.ceil(total / VENDOR_LOOKUP_LIMIT)),
      MAX_VENDOR_LOOKUP_PAGES
    );

    for (let page = 2; page <= totalPages; page += 1) {
      const response = await getVendors({
        page,
        limit: VENDOR_LOOKUP_LIMIT,
        search: "",
        status,
        sortBy: "POPULAR"
      });

      if (!response.success) continue;

      const match = (response.list || []).find((vendor) => vendor._id === vendorId);
      if (match?.slug) return match.slug;
    }
  }

  return undefined;
};

const mapReviewToUi = (review: ProductReviewDto): Review => {
  const firstName = review.member?.memberFirstName || review.member?.memberNickname || "Customer";
  const lastName = review.member?.memberLastName || "";

  return {
    id: review._id,
    rating: Number(review.rating || 0),
    comment: review.comment || "",
    customer: {
      id: review.member?._id || review.memberId,
      email: "",
      phone: "",
      avatar: review.member?.memberAvatar || "/assets/images/faces/propic.png",
      password: "",
      dateOfBirth: "",
      verified: true,
      name: {
        firstName,
        lastName
      }
    },
    // Review model requires product, but product review UI does not consume this field.
    product: {} as Product,
    published: review.status === "PUBLISHED"
  };
};

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const match = await findProductSummaryBySlug(slug);

  if (!match?._id) return null;

  const detail = await getProductById(match._id);
  if (!detail.product) return null;

  const product = mapDetailToProduct(detail.product);
  const vendorSlug = await resolveVendorSlug(detail.product.vendor?._id);
  const productWithResolvedShop = product.shop
    ? {
        ...product,
        shop: {
          ...product.shop,
          slug: vendorSlug || product.shop.slug
        }
      }
    : product;
  const categories = await resolveCategoryNames(detail.product.categoryIds || []);
  const fallbackRating = Number(match.ratingAvg || 0);
  const fallbackReviewsCount = Number(match.reviewsCount || 0);
  const reviewResponse = await getProductReviews({
    productId: match._id,
    page: 1,
    limit: PRODUCT_REVIEW_LIMIT,
    sortBy: "NEWEST"
  });

  if (!reviewResponse.success) {
    return {
      ...productWithResolvedShop,
      categories: categories.length ? categories : productWithResolvedShop.categories,
      rating: fallbackRating,
      reviewsCount: fallbackReviewsCount
    };
  }

  const mappedReviews = (reviewResponse.list || []).map(mapReviewToUi);
  const summaryRating = Number(reviewResponse.summary?.ratingAvg || 0);
  const summaryReviewsCount = Number(reviewResponse.summary?.reviewsCount || 0);
  const listAverageRating =
    mappedReviews.length > 0
      ? mappedReviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
        mappedReviews.length
      : 0;
  const resolvedRating = summaryRating > 0 ? summaryRating : fallbackRating || listAverageRating;
  const resolvedReviewsCount =
    summaryReviewsCount > 0 ? summaryReviewsCount : fallbackReviewsCount || mappedReviews.length;

  return {
    ...productWithResolvedShop,
    categories: categories.length ? categories : productWithResolvedShop.categories,
    rating: resolvedRating,
    reviewsCount: resolvedReviewsCount,
    reviews: mappedReviews
  };
}

export async function getRelatedProductsBySlug(slug: string, limit = 8): Promise<Product[]> {
  const match = await findProductSummaryBySlug(slug);

  if (!match?._id) return [];

  const related = await getRelatedProducts({ productId: match._id, limit });
  return (related.list || []).map(mapSummaryToProduct);
}

export async function getFrequentlyBoughtProducts(limit = 8): Promise<Product[]> {
  const featured = await getFeaturedProducts({ limit });
  return (featured.list || []).map(mapSummaryToProduct);
}

async function findProductSummaryBySlug(slug: string): Promise<ProductSummary | null> {
  const normalizedSlug = (slug || "").trim();
  if (!normalizedSlug) return null;

  const firstPage = await getProducts({
    page: 1,
    limit: PRODUCT_LOOKUP_LIMIT,
    sortBy: "NEWEST"
  });

  if (!firstPage.success) {
    console.error("[product-details] Failed to fetch products for slug lookup:", firstPage.error);
    return null;
  }

  const findInList = (list?: ProductSummary[]) =>
    (list || []).find((item) => item.slug === normalizedSlug) || null;

  const firstMatch = findInList(firstPage.list);
  if (firstMatch) return firstMatch;

  const total = firstPage.total || 0;
  const totalPages = Math.min(Math.ceil(total / PRODUCT_LOOKUP_LIMIT), MAX_PRODUCT_LOOKUP_PAGES);

  for (let page = 2; page <= totalPages; page += 1) {
    const pageData = await getProducts({ page, limit: PRODUCT_LOOKUP_LIMIT, sortBy: "NEWEST" });
    if (!pageData.success) continue;

    const match = findInList(pageData.list);
    if (match) return match;
  }

  return null;
}
