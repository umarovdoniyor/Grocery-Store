import type Address from "models/Address.model";
import type Payment from "models/Payment.model";
import type User from "models/User.model";
import type Ticket from "models/Ticket.model";
import type Product from "models/Product.model";
import productDatabase from "data/product-database";
import { messageList, ticketList } from "__server__/__db__/ticket/data";

const PAYMENT_METHODS: Payment[] = [
  {
    id: "1050017AB",
    exp: "10 / 2025",
    cvc: "123",
    user: "Ralf Edward",
    payment_method: "Mastercard",
    card_no: "1234 **** **** ****"
  },
  {
    id: "1050017AA",
    cvc: "123",
    exp: "08 / 2022",
    user: "Ralf Edward",
    payment_method: "Amex",
    card_no: "1234 **** **** ****"
  },
  {
    id: "1050017AC",
    cvc: "123",
    exp: "N/A",
    user: "Ralf Edward",
    payment_method: "PayPal",
    card_no: "ui-lib@email.com"
  },
  {
    id: "1050017AD",
    cvc: "123",
    exp: "08 / 2022",
    user: "Ralf Edward",
    payment_method: "Visa",
    card_no: "1234 **** **** ****"
  },
  {
    id: "1050017AE",
    cvc: "123",
    exp: "08 / 2022",
    user: "Ralf Edward",
    payment_method: "Amex",
    card_no: "1234 **** **** ****"
  },
  {
    id: "1050017AG",
    cvc: "123",
    exp: "N/A",
    user: "Ralf Edward",
    payment_method: "PayPal",
    card_no: "ui-lib@email.com"
  },
  {
    id: "1050017AF",
    cvc: "123",
    exp: "08 / 2022",
    user: "Ralf Edward",
    payment_method: "Visa",
    card_no: "1234 **** **** ****"
  }
];

const buildAddressList = (user?: User | null): Address[] => {
  if (!user) return [];

  return [
    {
      id: user.id || "primary-address",
      title: `${user.name.firstName} ${user.name.lastName}`.trim() || "Primary Address",
      city: "N/A",
      phone: user.phone || "N/A",
      street: user.address || "No address set",
      country: "N/A",
      user
    }
  ];
};

export function getCustomerAddressList(user?: User | null, page = 1) {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;
  const list = buildAddressList(user);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const addressList = list.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);

  return { addressList, totalPages };
}

export function getCustomerAddressById(user: User | null | undefined, id: string): Address | null {
  const list = buildAddressList(user);
  return list.find((item) => item.id === id) || list[0] || null;
}

export function getCustomerPayments(page = 1): { payments: Payment[]; totalPages: number } {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;
  const totalPages = Math.max(1, Math.ceil(PAYMENT_METHODS.length / PAGE_SIZE));
  const payments = PAYMENT_METHODS.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);
  return { payments, totalPages };
}

export function getCustomerPaymentById(id: string): Payment | null {
  return PAYMENT_METHODS.find((payment) => payment.id === id) || null;
}

export function getCustomerTickets(page = 1): { tickets: Ticket[]; totalPages: number } {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;
  const totalPages = Math.max(1, Math.ceil(ticketList.length / PAGE_SIZE));
  const tickets = ticketList.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);

  return { tickets, totalPages };
}

export function getCustomerTicketBySlug(slug: string): Ticket | null {
  const found = ticketList.find((item) => item.slug === slug);
  if (!found) return null;

  return {
    ...found,
    conversation: messageList
  };
}

export function getCustomerWishlistProducts(page = 1): { products: Product[]; totalPages: number } {
  const PAGE_SIZE = 6;
  const products = productDatabase.slice(0, 30);
  const currentProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    products: currentProducts,
    totalPages: Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  };
}
