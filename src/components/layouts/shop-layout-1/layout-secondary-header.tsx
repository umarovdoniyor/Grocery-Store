"use client";

import { usePathname } from "next/navigation";
import { CategoryList } from "components/categories";
import { SecondaryHeader } from "components/secondary-header";
import { SearchInput1 } from "components/search-box";
import type { Header } from "models/Layout.model";

interface Props {
  header: Header;
}

export default function LayoutSecondaryHeader({ header }: Props) {
  const pathname = usePathname();

  const hideOnProductDetails = pathname.startsWith("/products/") && pathname !== "/products/search";
  const hideOnShops = pathname.startsWith("/shops");
  const hideOnProfile = pathname.startsWith("/profile");
  const hideOnAddress = pathname.startsWith("/address");
  const hideOnOrders = pathname.startsWith("/orders");
  const hideOnWishlist = pathname.startsWith("/wish-list");
  const hideOnOrderConfirmation = pathname.startsWith("/order-confirmation");

  if (
    hideOnProductDetails ||
    hideOnShops ||
    hideOnProfile ||
    hideOnAddress ||
    hideOnOrders ||
    hideOnWishlist ||
    hideOnOrderConfirmation
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
