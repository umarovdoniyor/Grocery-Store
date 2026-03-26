import Container from "@mui/material/Container";
// LOCAL CUSTOM COMPONENTS
import ProductTabs from "../product-tabs";
import ProductIntro from "../product-intro";
import ProductReviews from "../product-reviews";
import AvailableShops from "../available-shops";
import RelatedProducts from "../related-products";
import ProductDescription from "../product-description";
import ProductViewRecorder from "components/product-view-recorder";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
interface Props {
  product: Product;
  relatedProducts: Product[];
}
// ==============================================================

export default function ProductDetailsPageView(props: Props) {
  const reviewCount = props.product.reviewsCount ?? props.product.reviews?.length ?? 0;
  const primaryCategoryId = props.product.categoryIds?.[0];
  const primaryCategoryName = props.product.categories?.[0];
  const currentShopId = props.product.shop?.id;

  return (
    <Container className="mt-2 mb-2">
      <ProductViewRecorder productId={props.product.id} />
      {/* PRODUCT DETAILS INFO AREA */}
      <ProductIntro product={props.product} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs
        description={<ProductDescription description={props.product.description} />}
        reviews={
          <ProductReviews
            productId={props.product.id}
            reviews={props.product.reviews}
            totalReviews={reviewCount}
            averageRating={Number(props.product.rating || 0)}
          />
        }
        reviewCount={reviewCount}
      />

      {/* AVAILABLE SHOPS AREA */}
      <AvailableShops
        categoryId={primaryCategoryId}
        categoryName={primaryCategoryName}
        excludedShopId={currentShopId}
      />

      {/* RELATED PRODUCTS AREA */}
      <RelatedProducts products={props.relatedProducts} />
    </Container>
  );
}
