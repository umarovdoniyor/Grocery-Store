import Link from "next/link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import FavoriteButton from "./favorite-button";
import DiscountChip from "../discount-chip";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
// STYLED COMPONENTS
import { PriceText, StyledRoot } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function ProductCard16({ product }: Props) {
  const { id, slug, title, thumbnail, price, discount, rating, reviewsCount } = product;

  return (
    <StyledRoot>
      <Link href={`/products/${slug}`}>
        <div className="img-wrapper">
          <LazyImage alt={title} width={380} height={379} src={thumbnail} />
          <FavoriteButton productId={id} />
          {discount ? <DiscountChip discount={discount} sx={{ left: 20, top: 20 }} /> : null}
        </div>
      </Link>

      <div className="content">
        <div>
          <Link href={`/products/${slug}`}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Rating readOnly value={rating} size="small" precision={0.5} />
            <Typography variant="body2" color="text.secondary">
              ({Number(reviewsCount || 0)})
            </Typography>
          </div>

          <PriceText>
            {calculateDiscount(price, discount)}
            {discount && <span className="base-price">{currency(price)}</span>}
          </PriceText>
        </div>

        {/* ADD TO CART BUTTON */}
        <AddToCart product={product} />
      </div>
    </StyledRoot>
  );
}
