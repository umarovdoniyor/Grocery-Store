import { cache } from "react";
import type LayoutModel from "models/Layout.model";
import { getCategories } from "../../../libs/category";
import navbarNavigation from "data/navbarNavigation";
import { categoryMenus } from "data/navigations";
import {
  categories as fallbackCategories,
  footerAboutLinks,
  footerCustomerCareLinks,
  footerDescription,
  footerSocialLinks,
  languageOptions,
  mobileNavigation,
  topbarSocialLinks
} from "data/layout-data";
import type { CategoryMenuItem } from "models/Category.model";
import type { Category } from "../../../libs/category";
import type { Menu, CategoryMenuItem as NavigationCategoryMenuItem } from "models/Navigation.model";

const footerContact = {
  phone: "+1 1123 456 780",
  email: "uilib.help@gmail.com",
  address: "70 Washington Square South, New York, NY 10012, United States"
};

async function getHeaderCategories() {
  const liveCategories = await getLiveCategories();

  const categoryOptions = liveCategories.map((item) => ({
    title: item.name,
    value: item.slug
  }));

  if (!categoryOptions.length) return fallbackCategories;

  return [{ title: "All Categories", value: "" }, ...categoryOptions];
}

async function getHeaderCategoryMenus(): Promise<CategoryMenuItem[]> {
  const liveCategories = await getLiveCategories();

  const liveMenus: CategoryMenuItem[] = liveCategories.map((item) => ({
    title: item.name,
    href: `/products/search?category=${item.slug}`,
    icon: "CategoryOutline"
  }));

  return liveMenus.length ? liveMenus : categoryMenus;
}

async function getLiveCategories(): Promise<Category[]> {
  const response = await getCategories({ page: 1, limit: 50, status: "ACTIVE" });
  return response.list || [];
}

async function getHeaderNavigation(): Promise<Menu[]> {
  const liveCategories = await getLiveCategories();

  if (!liveCategories.length) return navbarNavigation;

  const categoryMegaMenu: NavigationCategoryMenuItem[] = liveCategories.map((item) => ({
    title: item.name,
    child: [
      {
        title: "Browse",
        child: [
          {
            title: `All ${item.name}`,
            url: `/products/search?category=${item.slug}`,
            icon: "CategoryOutline"
          }
        ]
      }
    ]
  }));

  return navbarNavigation.map((nav) => {
    if (nav.title === "Categories" && nav.megaMenuWithSub) {
      return { ...nav, child: categoryMegaMenu };
    }

    return nav;
  });
}

export const getLayoutData = cache(async (): Promise<LayoutModel> => {
  const [categories, headerCategoryMenus, headerNavigation] = await Promise.all([
    getHeaderCategories(),
    getHeaderCategoryMenus(),
    getHeaderNavigation()
  ]);

  return {
    footer: {
      appStoreUrl: "#",
      playStoreUrl: "#",
      logo: "/assets/images/logo.svg",
      contact: footerContact,
      about: footerAboutLinks,
      socials: footerSocialLinks,
      description: footerDescription,
      customers: footerCustomerCareLinks
    },
    mobileNavigation: {
      version1: mobileNavigation,
      version2: mobileNavigation,
      logo: "/assets/images/bazaar-black-sm.svg"
    },
    topbar: {
      label: "HOT",
      title: "Free Express Shipping",
      socials: topbarSocialLinks,
      languageOptions
    },
    header: {
      categories,
      categoryMenus: headerCategoryMenus,
      navigation: headerNavigation,
      logo: "/assets/images/logo2.svg"
    }
  };
});
