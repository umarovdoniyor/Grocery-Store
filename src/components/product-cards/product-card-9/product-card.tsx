import Link from "next/link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
// LOCAL CUSTOM COMPONENTS
import DiscountChip from "../discount-chip";
import ProductPrice from "../product-price";
import ProductTags from "./components/tags";
import AddToCartButton from "./components/add-to-cart";
import FavoriteButton from "./components/favorite-button";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
// STYLED COMPONENT
import { ContentWrapper, Wrapper } from "./styles";

// ===========================================================
type Props = { product: Product };
// ===========================================================

export default function ProductCard9({ product }: Props) {
  const { id, thumbnail, title, price, discount, rating, slug, categories, reviewsCount } = product;
  const hasReviewData = Number(rating || 0) > 0 || Number(reviewsCount || 0) > 0;

  return (
    <Wrapper>
      {/* PRODUCT FAVORITE BUTTON */}
      <FavoriteButton productId={id} />

      <ContentWrapper>
        <div className="img-wrapper">
          {/* DISCOUNT PERCENT CHIP IF AVAILABLE */}
          <DiscountChip discount={discount} />

          {/* PRODUCT IMAGE / THUMBNAIL */}
          <LazyImage src={thumbnail} alt={title} width={500} height={500} />
        </div>

        <div className="content">
          <div>
            {/* PRODUCT TAG LIST */}
            <ProductTags tags={(categories || []).slice(0, 3)} />

            {/* PRODUCT TITLE / NAME */}
            <Link href={`/products/${slug}`}>
              <Typography
                variant="h5"
                sx={{
                  mt: 1,
                  mb: 1.25,
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 700,
                  color: "#1f2a1a",
                  lineHeight: 1.25
                }}
              >
                {title}
              </Typography>
            </Link>

            {/* PRODUCT RATING / REVIEW  */}
            {hasReviewData ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Rating size="small" value={rating} color="warn" readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  ({Number(reviewsCount || 0)})
                </Typography>
              </div>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet
              </Typography>
            )}

            {/* PRODUCT PRICE */}
            <ProductPrice price={price} discount={discount} />
          </div>

          {/* PRODUCT ADD TO CART BUTTON */}
          <AddToCartButton product={product} />
        </div>
      </ContentWrapper>
    </Wrapper>
  );
}
