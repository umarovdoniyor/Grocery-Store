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

  if (hideOnProductDetails) return null;

  return (
    <SecondaryHeader elevation={0}>
      <SecondaryHeader.Left>
        <CategoryList categories={header.categoryMenus} />
      </SecondaryHeader.Left>

      <SecondaryHeader.Right>
        <SearchInput1 categories={header.categories} />
      </SecondaryHeader.Right>
    </SecondaryHeader>
  );
}
