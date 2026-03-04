import { cache } from "react";
import Brand from "models/Brand.model";
import Order from "models/Order.model";
import Review from "models/Review.model";
import Product from "models/Product.model";
import Category from "models/Category.model";
import { brands as dbBrands } from "__server__/__db__/dashboard/brand";
import { orders as dbOrders } from "__server__/__db__/dashboard/orders";
import { reviews as dbReviews } from "__server__/__db__/dashboard/reviews";
import { payouts as dbPayouts } from "__server__/__db__/dashboard/payouts";
import { sellers as dbSellers } from "__server__/__db__/dashboard/sellers";
import { products as dbProducts } from "__server__/__db__/dashboard/products";
import { customers as dbCustomers } from "__server__/__db__/dashboard/customers";
import { categories as dbCategories } from "__server__/__db__/dashboard/categories";
import { refundRequest as dbRefundRequest } from "__server__/__db__/dashboard/refundRequests";
import { earningHistory as dbEarningHistory } from "__server__/__db__/dashboard/earning-history";
import { payoutRequests as dbPayoutRequests } from "__server__/__db__/dashboard/payout-requests";
import { packagePayments as dbPackagePayments } from "__server__/__db__/dashboard/package-payments";
import {
  cardList as dbCardList,
  recentPurchase as dbRecentPurchase,
  stockOutProducts as dbStockOutProducts
} from "__server__/__db__/dashboard/data";

// dashboard
const getAllCard = cache(async () => {
  return dbCardList;
});

const recentPurchase = cache(async () => {
  return dbRecentPurchase;
});

const stockOutProducts = cache(async () => {
  return dbStockOutProducts;
});

// products
const products = cache(async (): Promise<Product[]> => {
  return dbProducts as unknown as Product[];
});

const category = cache(async (): Promise<Category[]> => {
  return dbCategories as unknown as Category[];
});

const brands = cache(async (): Promise<Brand[]> => {
  return dbBrands as unknown as Brand[];
});

const reviews = cache(async (): Promise<Review[]> => {
  return dbReviews as unknown as Review[];
});

// orders
const orders = cache(async (): Promise<Order[]> => {
  return dbOrders as unknown as Order[];
});

const getOrder = cache(async (id: string): Promise<Order> => {
  const order = (dbOrders as unknown as Order[]).find((item) => item.id === id);
  return (order || dbOrders[0]) as unknown as Order;
});

// customers
const customers = cache(async () => {
  return dbCustomers;
});

// refund request
const refundRequests = cache(async () => {
  return dbRefundRequest;
});

// sellers
const sellers = cache(async () => {
  return dbSellers;
});

const packagePayments = cache(async () => {
  return dbPackagePayments;
});

const earningHistory = cache(async () => {
  return dbEarningHistory;
});

const payouts = cache(async () => {
  return dbPayouts;
});

const payoutRequests = cache(async () => {
  return dbPayoutRequests;
});

export default {
  brands,
  orders,
  reviews,
  sellers,
  payouts,
  products,
  category,
  getOrder,
  customers,
  getAllCard,
  payoutRequests,
  recentPurchase,
  refundRequests,
  earningHistory,
  packagePayments,
  stockOutProducts
};
