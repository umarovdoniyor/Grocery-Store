import categoriesMegaMenu from "./categoriesMegaMenu";
import { Menu } from "models/Navigation.model";

// MAIN NAVIGATION DATA
const navbarNavigation: Menu[] = [
  {
    megaMenu: false,
    megaMenuWithSub: true,
    title: "Categories",
    child: categoriesMegaMenu
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Vendors",
    child: [
      { title: "All Vendors", url: "/shops" },
      { title: "Become a Vendor", url: "/become-vendor" }
    ]
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Deals",
    child: [
      { title: "Flash Sales", url: "/products/search?tag=flash-sale" },
      { title: "Weekly Deals", url: "/products/search?tag=weekly-deal" },
      { title: "Clearance", url: "/products/search?tag=clearance" }
    ]
  }
];

export default navbarNavigation;
