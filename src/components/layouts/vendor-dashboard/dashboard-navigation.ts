import duotone from "icons/duotone";
import { UserRole } from "models/User.model";

const adminNavigation = [
  { type: "label", label: "Admin" },
  {
    name: "Orders",
    icon: duotone.Order,
    path: "/admin/orders"
  },
  {
    name: "Products",
    icon: duotone.Products,
    path: "/admin/products"
  },
  {
    name: "Categories",
    icon: duotone.Accounts,
    path: "/admin/categories"
  },
  {
    name: "Customers",
    icon: duotone.Customers,
    path: "/admin/customers"
  },
  {
    name: "Vendor Applications",
    icon: duotone.Seller,
    path: "/admin/sellers"
  }
];

const vendorNavigation = [
  { type: "label", label: "Vendor" },
  {
    name: "Dashboard",
    icon: duotone.Dashboard,
    path: "/vendor/dashboard"
  },
  {
    name: "Reviews",
    icon: duotone.Review,
    path: "/vendor/reviews"
  },
  {
    name: "Account Settings",
    icon: duotone.AccountSetting,
    path: "/vendor/account-settings"
  }
];

export const getDashboardNavigation = (role?: UserRole) => {
  if (role === "admin") return adminNavigation;
  if (role === "vendor") return vendorNavigation;
  return [];
};
