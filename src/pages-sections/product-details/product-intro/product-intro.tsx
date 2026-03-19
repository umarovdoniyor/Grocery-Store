import Link from "next/link";
// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import ProductGallery from "./product-gallery";
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
  const code = product.sku || product.slug || product.id || "-";
  const unit = product.unit ? String(product.unit) : "-";
  const categoryLabel = product.categories?.length ? product.categories.join(", ") : "-";
  const reviewCount = product.reviewsCount ?? product.reviews?.length ?? 0;
  const viewCount = Number(product.views || 0);
  const formattedViewCount = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(viewCount);

  return (
    <StyledRoot>
      <Grid container spacing={3} justifyContent="space-around">
        {/* IMAGE GALLERY AREA */}
        <Grid size={{ lg: 6, md: 7, xs: 12 }}>
          <ProductGallery images={product.images!} />
        </Grid>

        <Grid size={{ lg: 5, md: 5, xs: 12 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, color: "#1f2a1a", mb: 1.5, lineHeight: 1.25 }}
          >
            {product.title}
          </Typography>

          {/* META PILLS */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Box sx={{ fontSize: 12, px: 1.5, py: 0.4, borderRadius: 999, bgcolor: "rgba(111,143,68,0.12)", color: "#3d5a20", fontWeight: 500 }}>
              {categoryLabel}
            </Box>
            <Box sx={{ fontSize: 12, px: 1.5, py: 0.4, borderRadius: 999, bgcolor: "rgba(0,0,0,0.05)", color: "text.secondary", fontWeight: 500 }}>
              SKU: {code}
            </Box>
            <Box sx={{ fontSize: 12, px: 1.5, py: 0.4, borderRadius: 999, bgcolor: "rgba(0,0,0,0.05)", color: "text.secondary", fontWeight: 500 }}>
              Unit: {unit}
            </Box>
            {product.brand && (
              <Box sx={{ fontSize: 12, px: 1.5, py: 0.4, borderRadius: 999, bgcolor: "rgba(0,0,0,0.05)", color: "text.secondary", fontWeight: 500 }}>
                Brand: {product.brand}
              </Box>
            )}
          </Box>

          {/* PRODUCT RATING */}
          <div className="rating">
            <span>Rated:</span>
            <Rating readOnly color="warn" size="small" value={product.rating} />
            <Typography variant="h6">({reviewCount})</Typography>
          </div>

          <div className="views">
            <RemoveRedEyeOutlined sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {formattedViewCount} views
            </Typography>
          </div>

          {/* PRICE & STOCK */}
          <div className="price">
            <Box display="flex" alignItems="baseline" gap={1.5} mb={0.75}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#3d6b2a", lineHeight: 1 }}>
                {currency(basePrice)}
              </Typography>
              {comparePrice && (
                <Typography sx={{ fontSize: 16, fontWeight: 400, color: "text.disabled", textDecoration: "line-through" }}>
                  {currency(comparePrice)}
                </Typography>
              )}
              {discountPercent > 0 && (
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", bgcolor: "#e05c2a", borderRadius: 999, px: 1, py: 0.25, lineHeight: 1.6 }}>
                  -{discountPercent}%
                </Typography>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: "#4a7c35", fontWeight: 500 }}>✓ In Stock</Typography>
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
