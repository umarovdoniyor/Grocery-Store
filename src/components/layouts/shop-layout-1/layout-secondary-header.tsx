"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { CategoryList } from "components/categories";
import { SecondaryHeader } from "components/secondary-header";
import { SearchInput1 } from "components/search-box";
import type { Header } from "models/Layout.model";

interface Props {
  header: Header;
}

export default function LayoutSecondaryHeader({ header }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  const hideOnProductDetails = pathname.startsWith("/products/") && pathname !== "/products/search";
  const hideOnLegacyDealsSearch =
    pathname === "/products/search" &&
    (tag === "flash-sale" || tag === "weekly-deal" || tag === "clearance");
  const hideOnShops = pathname.startsWith("/shops");
  const hideOnProfile = pathname.startsWith("/profile");
  const hideOnAddress = pathname.startsWith("/address");
  const hideOnOrders = pathname.startsWith("/orders");
  const hideOnWishlist = pathname.startsWith("/wish-list");
  const hideOnOrderConfirmation = pathname.startsWith("/order-confirmation");
  const hideOnCart = pathname.startsWith("/cart");
  const hideOnCheckout = pathname.startsWith("/checkout");
  const hideOnPayment = pathname.startsWith("/payment");
  const hideOnDeals = pathname.startsWith("/deals");

  if (
    hideOnProductDetails ||
    hideOnLegacyDealsSearch ||
    hideOnShops ||
    hideOnProfile ||
    hideOnAddress ||
    hideOnOrders ||
    hideOnWishlist ||
    hideOnOrderConfirmation ||
    hideOnCart ||
    hideOnCheckout ||
    hideOnPayment ||
    hideOnDeals
  )
    return null;

  return (
    <SecondaryHeader elevation={0} sx={{ mt: 1.25 }}>
      <SecondaryHeader.Left>
        <CategoryList categories={header.categoryMenus} />
      </SecondaryHeader.Left>

      <SecondaryHeader.Right>
        <SearchInput1 categories={header.categories} />
      </SecondaryHeader.Right>
    </SecondaryHeader>
  );
}
