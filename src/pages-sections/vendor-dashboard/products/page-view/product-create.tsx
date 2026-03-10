// LOCAL CUSTOM COMPONENT
import ProductForm from "../product-form";
import PageWrapper from "../../page-wrapper";

type Props = {
  basePath?: string;
  mode?: "create" | "edit";
};

export default function ProductCreatePageView({
  basePath = "/admin/products",
  mode = "create"
}: Props) {
  return (
    <PageWrapper title="Add New Product">
      <ProductForm mode={mode} basePath={basePath} />
    </PageWrapper>
  );
}
