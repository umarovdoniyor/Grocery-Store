import type { PropsWithChildren } from "react";
import ShopLayout1 from "components/layouts/shop-layout-1";
import { getLayoutData } from "utils/services/layout-data";

export default async function DealsLayout({ children }: PropsWithChildren) {
  const data = await getLayoutData();
  return <ShopLayout1 data={data}>{children}</ShopLayout1>;
}
