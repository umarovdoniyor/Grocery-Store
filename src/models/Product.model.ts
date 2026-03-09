import Shop from "./Shop.model";
import Review from "./Review.model";

export default interface Product {
  unit?: any;
  slug: string;
  price: number;
  title: string;
  rating: number;
  reviewsCount?: number;
  likes?: number;
  views?: number;
  meLiked?: boolean;
  meViewed?: boolean;
  discount: number;
  thumbnail: string;
  description?: string;
  id: string;
  shop?: Shop;
  brand?: string;
  sku?: string;
  size?: string[];
  status?: string;
  colors?: string[];
  images: string[];
  categories: any[];
  categoryIds?: string[];
  reviews?: Review[];
  published?: boolean;
}
