// LOCAL CUSTOM COMPONENT
import ProductForm from "../product-form";
import PageWrapper from "../../page-wrapper";

type Props = {
  productId?: string;
  basePath?: string;
  mode?: "create" | "edit";
};

export default function EditProductPageView({
  productId,
  basePath = "/admin/products",
  mode = "edit"
}: Props) {
  return (
    <PageWrapper title="Edit Product">
      <ProductForm mode={mode} productId={productId} basePath={basePath} />
    </PageWrapper>
  );
}
