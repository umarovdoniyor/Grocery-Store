import Link from "next/link";
// MUI
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import ProductGallery from "./product-gallery";
import ProductVariantSelector from "./product-variant-selector";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// STYLED COMPONENTS
import { StyledRoot } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ================================================================
type Props = { product: Product };
// ================================================================

export default function ProductIntro({ product }: Props) {
  const basePrice = Number(product.price || 0);
  const discountPercent = Number(product.discount || 0);
  const comparePrice =
    discountPercent > 0 ? basePrice / (1 - Math.min(discountPercent, 99) / 100) : null;
  const code = product.id || product.slug || "-";
  const categoryLabel = product.categories?.length ? product.categories.join(", ") : "-";

  return (
    <StyledRoot>
      <Grid container spacing={3} justifyContent="space-around">
        {/* IMAGE GALLERY AREA */}
        <Grid size={{ lg: 6, md: 7, xs: 12 }}>
          <ProductGallery images={product.images!} />
        </Grid>

        <Grid size={{ lg: 5, md: 5, xs: 12 }}>
          <Typography variant="h1">{product.title}</Typography>

          <Typography variant="body1">
            Category: <strong>{categoryLabel}</strong>
          </Typography>

          <Typography variant="body1">
            Product Code: <strong>{code}</strong>
          </Typography>

          {/* PRODUCT BRAND */}
          {product.brand && (
            <p className="brand">
              Brand: <strong>{product.brand}</strong>
            </p>
          )}

          {/* PRODUCT RATING */}
          <div className="rating">
            <span>Rated:</span>
            <Rating readOnly color="warn" size="small" value={product.rating} />
            <Typography variant="h6">({product.reviews?.length || 0})</Typography>
          </div>

          {/* PRODUCT VARIANTS */}
          <ProductVariantSelector />

          {/* PRICE & STOCK */}
          <div className="price">
            <Typography variant="h2" sx={{ color: "primary.main", mb: 0.5, lineHeight: 1 }}>
              {currency(basePrice)}
              {comparePrice && (
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "text.secondary",
                    textDecoration: "line-through"
                  }}
                >
                  {currency(comparePrice)}
                </Typography>
              )}
            </Typography>

            <p>Stock Available</p>
          </div>

          {/* ADD TO CART BUTTON */}
          <AddToCart product={product} />

          {/* SHOP NAME */}
          {product.shop && (
            <p className="shop">
              Sold By:
              <Link href={`/shops/${product.shop.slug}`}>
                <strong>{product.shop.name}</strong>
              </Link>
            </p>
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
