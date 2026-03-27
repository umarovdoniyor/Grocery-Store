import { Fragment } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM COMPONENTS
import Setting from "components/settings";
import Newsletter from "components/newsletter";
import StickyWrapper from "components/sticky-wrapper";
import SideNavbar from "components/page-sidenav/side-navbar";
import { MobileNavigationBar2 } from "components/mobile-navigation";
import { Footer2 } from "components/footer";
import HashScroller from "components/hash-scroller";
// LOCAL CUSTOM COMPONENTS
import Section1 from "../section-1";
import Section2 from "../section-2";
import Section3 from "../section-3";
import Section4 from "../section-4";
import Section5 from "../section-5";
import Home from "icons/Home";
import User2 from "icons/User2";
import CategoryOutlined from "icons/CategoryOutline";
import ShoppingBagOutlined from "icons/ShoppingBagOutlined";
import {
  getFeaturedProducts,
  getGroceryProducts,
  getPopularProducts,
  getTrendingProducts,
  getGrocery1Navigation
} from "utils/services/grocery-home";
import { getLayoutData } from "utils/services/layout-data";
import type LayoutModel from "models/Layout.model";

// =====================================================
type Props = {
  selected?: { title: string; slug: string; parent?: { title: string; slug: string } | null };
  layoutData?: LayoutModel;
};
// =====================================================

export default async function GroceryOnePageView({ selected, layoutData }: Props) {
  const [products, grocery1NavList] = await Promise.all([
    getGroceryProducts(selected?.slug),
    getGrocery1Navigation()
  ]);

  const [featuredProducts, popularProducts, trendingProducts] = selected
    ? [[], [], []]
    : await Promise.all([getFeaturedProducts(), getPopularProducts(), getTrendingProducts()]);

  const resolvedLayoutData = layoutData || (await getLayoutData());

  const mobileIconMap = {
    Home,
    CategoryOutlined,
    ShoppingBagOutlined,
    User2
  };

  const mobileNavigation = (resolvedLayoutData.mobileNavigation.version2 || [])
    .map((item) => ({
      ...item,
      Icon: mobileIconMap[item.icon as keyof typeof mobileIconMap]
    }))
    .filter((item) => Boolean(item.Icon));

  // SIDE NAVBAR COMPONENT
  const SideNav = (
    <Box>
      {selected && (
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Link href="/#products">
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
              ✕ Clear Category
            </Button>
          </Link>
        </Box>
      )}
      <SideNavbar navList={grocery1NavList} />
    </Box>
  );

  return (
    <Fragment>
      <HashScroller />

      {/* TOP HERO AREA */}
      <Section1 />

      {/* SERVICE AREA */}
      <Section2 />

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <StickyWrapper SideNav={SideNav}>
        {selected ? (
          <Section4 products={products} title={selected.title} parentCategory={selected.parent} />
        ) : (
          <Fragment>
            {/* FEATURED PRODUCTS AREA */}
            <Section3 title="Featured Products" products={featuredProducts} />

            {/* POPULAR PRODUCTS AREA */}
            <Section3 title="Popular Products" products={popularProducts} />

            {/* TRENDING PRODUCTS AREA */}
            <Section3 title="Trending Products" products={trendingProducts} />

            {/* ALL PRODUCTS AREA */}
            <Section4 products={products} />
          </Fragment>
        )}

        {/* DISCOUNT BANNER AREA */}
        <Section5 />

        {/* FOOTER AREA */}
        <Footer2 footer={resolvedLayoutData.footer} />
      </StickyWrapper>

      {/* POPUP NEWSLETTER FORM */}
      <Newsletter image="/assets/images/newsletter/bg-2.png" />

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
      <Setting />

      <MobileNavigationBar2 navigation={mobileNavigation}>{SideNav}</MobileNavigationBar2>
    </Fragment>
  );
}
