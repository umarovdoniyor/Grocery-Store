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
import { getProductReviews, type ProductReview as ProductReviewDto } from "../../../libs/review";

const PRODUCT_LOOKUP_LIMIT = 50;
const MAX_PRODUCT_LOOKUP_PAGES = 20;
const PRODUCT_REVIEW_LIMIT = 10;

const toDiscount = (price: number, salePrice?: number) => {
  if (!salePrice || price <= salePrice || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const mapVendorToShop = (vendor?: ProductDetail["vendor"]): Shop | undefined => {
  if (!vendor?._id) return undefined;

  const shopName =
    vendor.memberNickname ||
    `${vendor.memberFirstName || ""} ${vendor.memberLastName || ""}`.trim();

  return {
    id: vendor._id,
    slug: vendor._id,
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

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail,
    images: [item.thumbnail],
    price,
    discount: toDiscount(price, salePrice),
    rating: 0,
    reviews: [],
    categories: [],
    status: item.status,
    published: item.status === "PUBLISHED"
  };
};

const mapDetailToProduct = (item: ProductDetail): Product => {
  const price = Number(item.salePrice ?? item.price ?? 0);
  const basePrice = Number(item.price || 0);

  return {
    id: item._id,
    slug: item.slug,
    title: item.title,
    thumbnail: item.thumbnail,
    images: item.images?.length ? item.images : [item.thumbnail],
    price,
    discount: toDiscount(basePrice, item.salePrice),
    rating: 0,
    reviews: [],
    brand: item.brand,
    description: item.description,
    categories: item.categoryIds || [],
    status: item.status,
    published: item.status === "PUBLISHED",
    shop: mapVendorToShop(item.vendor)
  };
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
  const reviewResponse = await getProductReviews({
    productId: match._id,
    page: 1,
    limit: PRODUCT_REVIEW_LIMIT,
    sortBy: "NEWEST"
  });

  if (!reviewResponse.success) {
    return product;
  }

  return {
    ...product,
    rating: Number(reviewResponse.summary?.ratingAvg || 0),
    reviews: (reviewResponse.list || []).map(mapReviewToUi)
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
