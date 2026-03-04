import MockAdapter from "axios-mock-adapter";

import { Grocery1Endpoints } from "./__db__/grocery-1";

import { ShopEndpoints } from "./__db__/shop";
import { UsersEndpoints } from "./__db__/users";
import { TicketsEndpoints } from "./__db__/ticket";
import { VendorEndpoints } from "./__db__/vendor";
import { UserOrders1Endpoints } from "./__db__/orders";
import { UserAddressEndpoints } from "./__db__/address";
import { ProductsEndpoints } from "./__db__/products";
import { AdminDashboardEndpoints } from "./__db__/dashboard";
import { RelatedProductsEndpoints } from "./__db__/related-products";

import { LayoutEndpoints } from "./__db__/layout";
import { CartEndpoints } from "./__db__/cart";

type MockEndpointOptions = {
  enableDashboardMocks?: boolean;
};

export const MockEndPoints = (Mock: MockAdapter, options?: MockEndpointOptions) => {
  const enableDashboardMocks = options?.enableDashboardMocks ?? true;

  Grocery1Endpoints(Mock);

  ShopEndpoints(Mock);
  UsersEndpoints(Mock);
  VendorEndpoints(Mock);
  TicketsEndpoints(Mock);
  ProductsEndpoints(Mock);
  UserAddressEndpoints(Mock);
  UserOrders1Endpoints(Mock);
  if (enableDashboardMocks) {
    AdminDashboardEndpoints(Mock);
  }
  RelatedProductsEndpoints(Mock);

  LayoutEndpoints(Mock);
  CartEndpoints(Mock);

  Mock.onAny().passThrough();
};
