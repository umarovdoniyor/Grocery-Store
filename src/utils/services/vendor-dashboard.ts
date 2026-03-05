import type Ticket from "models/Ticket.model";
import { ticketList } from "__server__/__db__/ticket/data";
import {
  productReviews,
  payoutRequests as vendorPayoutRequests
} from "__server__/__db__/vendor/data";
import { payouts } from "__server__/__db__/dashboard/payouts";
import { refundRequest } from "__server__/__db__/dashboard/refundRequests";
import { earningHistory } from "__server__/__db__/dashboard/earning-history";

export async function getVendorSupportTickets(): Promise<Ticket[]> {
  return ticketList;
}

export async function getVendorReviews() {
  return productReviews;
}

export async function getVendorPayoutRequests() {
  return vendorPayoutRequests;
}

export async function getVendorPayouts() {
  return payouts;
}

export async function getVendorRefundRequests() {
  return refundRequest;
}

export async function getVendorEarningHistory() {
  return earningHistory;
}
