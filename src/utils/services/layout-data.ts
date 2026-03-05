import { cache } from "react";
import type LayoutModel from "models/Layout.model";
import navbarNavigation from "data/navbarNavigation";
import { categoryMenus } from "data/navigations";
import * as db from "__server__/__db__/layout/data";

export const getLayoutData = cache(async (): Promise<LayoutModel> => {
  return {
    footer: {
      appStoreUrl: "#",
      playStoreUrl: "#",
      logo: "/assets/images/logo.svg",
      contact: db.footerContact,
      about: db.footerAboutLinks,
      socials: db.footerSocialLinks,
      description: db.footerDescription,
      customers: db.footerCustomerCareLinks
    },
    mobileNavigation: {
      version1: db.mobileNavigation,
      version2: db.mobileNavigationTwo,
      logo: "/assets/images/bazaar-black-sm.svg"
    },
    topbar: {
      label: "HOT",
      title: "Free Express Shipping",
      socials: db.topbarSocialLinks,
      languageOptions: db.languageOptions
    },
    header: {
      categories: db.categories,
      categoryMenus,
      navigation: navbarNavigation,
      logo: "/assets/images/logo2.svg"
    }
  };
});
