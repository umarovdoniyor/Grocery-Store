import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import Setting from "components/settings";
import Newsletter from "components/newsletter";
import StickyWrapper from "components/sticky-wrapper";
import SideNavbar from "components/page-sidenav/side-navbar";
import { MobileNavigationBar2 } from "components/mobile-navigation";
import { Footer2 } from "components/footer";
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
  getGroceryProducts,
  getPopularProducts,
  getTrendingProducts,
  getGrocery1Navigation
} from "utils/services/grocery-home";
import { getLayoutData } from "utils/services/layout-data";

// =====================================================
type Props = { selected?: string };
// =====================================================

export default async function GroceryOnePageView({ selected }: Props) {
  const [products, popularProducts, trendingProducts, grocery1NavList, layoutData] =
    await Promise.all([
      getGroceryProducts(selected),
      getPopularProducts(),
      getTrendingProducts(),
      getGrocery1Navigation(),
      getLayoutData()
    ]);

  const mobileIconMap = {
    Home,
    CategoryOutlined,
    ShoppingBagOutlined,
    User2
  };

  const mobileNavigation = (layoutData.mobileNavigation.version2 || [])
    .map((item) => ({
      ...item,
      Icon: mobileIconMap[item.icon as keyof typeof mobileIconMap]
    }))
    .filter((item) => Boolean(item.Icon));

  // SIDE NAVBAR COMPONENT
  const SideNav = <SideNavbar navList={grocery1NavList} />;

  return (
    <Fragment>
      {/* TOP HERO AREA */}
      <Section1 />

      {/* SERVICE AREA */}
      <Section2 />

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <StickyWrapper SideNav={SideNav}>
        {selected ? (
          <Section4 products={products} title={selected} />
        ) : (
          <Fragment>
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
        <Footer2 footer={layoutData.footer} />
      </StickyWrapper>

      {/* POPUP NEWSLETTER FORM */}
      <Newsletter image="/assets/images/newsletter/bg-2.png" />

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
      <Setting />

      <MobileNavigationBar2 navigation={mobileNavigation}>{SideNav}</MobileNavigationBar2>
    </Fragment>
  );
}
