export interface CategoryNavItem {
  icon?: string;
  image?: string;
  title: string;
  href?: string;
  child?: { title: string; href: string; icon?: string; image?: string }[];
}

export default interface CategoryNavList {
  category: string;
  categoryItem: CategoryNavItem[];
}
