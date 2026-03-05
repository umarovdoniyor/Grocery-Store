import Brand from "models/Brand.model";
import Review from "models/Review.model";
import { brands } from "__server__/__db__/dashboard/brand";
import { reviews } from "__server__/__db__/dashboard/reviews";
import { payouts } from "__server__/__db__/dashboard/payouts";
import { refundRequest } from "__server__/__db__/dashboard/refundRequests";
import { earningHistory } from "__server__/__db__/dashboard/earning-history";
import { payoutRequests } from "__server__/__db__/dashboard/payout-requests";
import { packagePayments } from "__server__/__db__/dashboard/package-payments";
import { cardList, recentPurchase, stockOutProducts } from "__server__/__db__/dashboard/data";

export async function getAdminBrands(): Promise<Brand[]> {
  return brands as unknown as Brand[];
}

export async function getAdminProductReviews(): Promise<Review[]> {
  return reviews as unknown as Review[];
}

export async function getAdminPackagePayments() {
  return packagePayments;
}

export async function getAdminRefundRequests() {
  return refundRequest;
}

export async function getAdminEarningHistory() {
  return earningHistory;
}

export async function getAdminPayouts() {
  return payouts;
}

export async function getAdminPayoutRequests() {
  return payoutRequests;
}

export async function getAdminDashboardCards() {
  return cardList;
}

export async function getAdminRecentPurchase() {
  return recentPurchase;
}

export async function getAdminStockOutProducts() {
  return stockOutProducts;
}
