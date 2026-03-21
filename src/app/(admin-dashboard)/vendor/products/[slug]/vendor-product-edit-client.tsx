"use client";

import dynamic from "next/dynamic";
import PageWrapper from "pages-sections/vendor-dashboard/page-wrapper";

const ProductForm = dynamic(() => import("pages-sections/vendor-dashboard/products/product-form"), {
  loading: () => null,
  ssr: false
});

type Props = {
  productId: string;
};

export default function VendorProductEditClient({ productId }: Props) {
  return (
    <PageWrapper title="Edit Product">
      <ProductForm mode="edit" productId={productId} basePath="/vendor/products" />
    </PageWrapper>
  );
}
