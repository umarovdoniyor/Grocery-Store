import Accounts from "icons/duotone/Accounts";
import AccountSetting from "icons/duotone/AccountSetting";
import Customers from "icons/duotone/Customers";
import Dashboard from "icons/duotone/Dashboard";
import Order from "icons/duotone/Order";
import Products from "icons/duotone/Products";
import Review from "icons/duotone/Review";
import Seller from "icons/duotone/Seller";
import Settings from "icons/duotone/Settings";
import { UserRole } from "models/User.model";

const adminNavigation = [
  { type: "label", label: "Admin" },
  {
    name: "Dashboard",
    icon: Dashboard,
    path: "/admin/dashboard"
  },
  {
    name: "Orders",
    icon: Order,
    path: "/admin/orders"
  },
  {
    name: "Products",
    icon: Products,
    path: "/admin/products"
  },
  {
    name: "Categories",
    icon: Accounts,
    path: "/admin/categories"
  },
  {
    name: "Customers",
    icon: Customers,
    path: "/admin/customers"
  },
  {
    name: "Vendor Applications",
    icon: Seller,
    path: "/admin/sellers"
  },
  {
    name: "Review Moderation",
    icon: Review,
    path: "/admin/products/reviews"
  },
  {
    name: "Account Settings",
    icon: AccountSetting,
    path: "/admin/account-settings"
  }
];

const vendorNavigation = [
  { type: "label", label: "Vendor" },
  {
    name: "Dashboard",
    icon: Dashboard,
    path: "/vendor/dashboard"
  },
  {
    name: "Orders",
    icon: Order,
    path: "/vendor/orders"
  },
  {
    name: "Products",
    icon: Products,
    children: [
      { name: "Product List", path: "/vendor/products" },
      { name: "Create Product", path: "/vendor/products/create" }
    ]
  },
  {
    name: "Reviews",
    icon: Review,
    path: "/vendor/reviews"
  },
  {
    name: "Account Settings",
    icon: AccountSetting,
    path: "/vendor/account-settings"
  },
  {
    name: "Shop Settings",
    icon: Settings,
    path: "/vendor/shop-settings"
  }
];

export const getDashboardNavigation = (role?: UserRole) => {
  if (role === "admin") return adminNavigation;
  if (role === "vendor") return vendorNavigation;
  return [];
};
