import { cache } from "react";
import type LayoutModel from "models/Layout.model";
import { getCategories, getCategoryTree } from "../../../libs/category";
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
import type { Category, CategoryTreeNode } from "../../../libs/category";
import type { Menu, CategoryMenuItem as NavigationCategoryMenuItem } from "models/Navigation.model";

const footerContact = {
  phone: "+1 1123 456 780",
  email: "uilib.help@gmail.com",
  address: "70 Washington Square South, New York, NY 10012, United States"
};

function flattenCategoryTree(tree: CategoryTreeNode[]): CategoryTreeNode[] {
  const result: CategoryTreeNode[] = [];

  const traverse = (nodes: CategoryTreeNode[]) => {
    nodes.forEach((node) => {
      result.push(node);
      if (node.children?.length) {
        traverse(node.children);
      }
    });
  };

  traverse(tree);
  return result;
}

function toCategoryLink(slug: string) {
  return `/products/search?category=${slug}`;
}

function toVisual(node: CategoryTreeNode) {
  return {
    icon: node.icon || undefined,
    img: node.image || undefined
  };
}

function buildGroupedChildrenForCategoryList(parent: CategoryTreeNode): CategoryMenuItem[] {
  const children = parent.children || [];

  if (!children.length) {
    return [
      {
        title: "Browse",
        href: toCategoryLink(parent.slug),
        children: [
          {
            title: `All ${parent.name}`,
            href: toCategoryLink(parent.slug),
            ...toVisual(parent)
          }
        ]
      }
    ];
  }

  const hasThirdLevel = children.some((child) => (child.children || []).length > 0);

  if (!hasThirdLevel) {
    return [
      {
        title: `All ${parent.name}`,
        href: toCategoryLink(parent.slug),
        ...toVisual(parent)
      },
      ...children.map((child) => ({
        title: child.name,
        href: toCategoryLink(child.slug),
        ...toVisual(child)
      }))
    ];
  }

  return children.map((child) => {
    const thirdLevel = child.children || [];

    return {
      title: child.name,
      href: toCategoryLink(child.slug),
      ...toVisual(child),
      children: thirdLevel.length
        ? [
            {
              title: `All ${child.name}`,
              href: toCategoryLink(child.slug),
              ...toVisual(child)
            },
            ...thirdLevel.map((leaf) => ({
              title: leaf.name,
              href: toCategoryLink(leaf.slug),
              ...toVisual(leaf)
            }))
          ]
        : [{ title: `All ${child.name}`, href: toCategoryLink(child.slug), ...toVisual(child) }]
    };
  });
}

function buildGroupedChildrenForHeaderNav(
  parent: CategoryTreeNode
): NavigationCategoryMenuItem["child"] {
  const children = parent.children || [];

  if (!children.length) {
    return [
      {
        title: "Browse",
        child: [
          {
            title: `All ${parent.name}`,
            url: toCategoryLink(parent.slug),
            ...toVisual(parent)
          }
        ]
      }
    ];
  }

  const hasThirdLevel = children.some((child) => (child.children || []).length > 0);

  if (!hasThirdLevel) {
    return children.map((child) => ({
      title: child.name,
      child: [
        {
          title: child.name,
          url: toCategoryLink(child.slug),
          ...toVisual(child)
        }
      ]
    }));
  }

  return children.map((child) => {
    const thirdLevel = child.children || [];

    return {
      title: child.name,
      child: thirdLevel.length
        ? [
            {
              title: `All ${child.name}`,
              url: toCategoryLink(child.slug),
              ...toVisual(child)
            },
            ...thirdLevel.map((leaf) => ({
              title: leaf.name,
              url: toCategoryLink(leaf.slug),
              ...toVisual(leaf)
            }))
          ]
        : [
            {
              title: `All ${child.name}`,
              url: toCategoryLink(child.slug),
              ...toVisual(child)
            }
          ]
    };
  });
}

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
  const treeResponse = await getCategoryTree();

  if (treeResponse.success && treeResponse.tree?.length) {
    const liveMenus: CategoryMenuItem[] = treeResponse.tree.map((parent) => ({
      title: parent.name,
      href: toCategoryLink(parent.slug),
      ...toVisual(parent),
      component: "List",
      children: buildGroupedChildrenForCategoryList(parent)
    }));

    return liveMenus;
  }

  return categoryMenus;
}

async function getLiveCategories(): Promise<Category[]> {
  const treeResponse = await getCategoryTree();

  if (treeResponse.success && treeResponse.tree?.length) {
    const flat = flattenCategoryTree(treeResponse.tree);
    return flat.map((item) => ({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      status: "ACTIVE",
      sortOrder: 0,
      parentId: item.parentId || null,
      createdAt: "",
      updatedAt: ""
    }));
  }

  const response = await getCategories({ page: 1, limit: 200, status: "ACTIVE" });
  return response.list || [];
}

async function getHeaderNavigation(): Promise<Menu[]> {
  const treeResponse = await getCategoryTree();

  let categoryMegaMenu: NavigationCategoryMenuItem[] = [];

  if (treeResponse.success && treeResponse.tree?.length) {
    categoryMegaMenu = treeResponse.tree.map((parent) => ({
      title: parent.name,
      child: buildGroupedChildrenForHeaderNav(parent)
    }));
  } else {
    const liveCategories = await getLiveCategories();

    if (!liveCategories.length) return navbarNavigation;

    categoryMegaMenu = liveCategories.map((item) => ({
      title: item.name,
      child: [
        {
          title: "Browse",
          child: [
            {
              title: `All ${item.name}`,
              url: toCategoryLink(item.slug),
              icon: "CategoryOutline"
            }
          ]
        }
      ]
    }));
  }

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
