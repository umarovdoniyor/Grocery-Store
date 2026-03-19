import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import ButtonGroup from "./button-group";
import ImageCarousel from "./image-carousel";
import QuickViewModal from "./quick-view-modal";

import { currency } from "lib";

import Product from "models/Product.model";

// =====================================================
type Props = { product: Product };
// =====================================================

export default function ProductQuickView({ product }: Props) {
  const basePrice = Number(product.price || 0);
  const discountPercent = Number(product.discount || 0);
  const comparePrice =
    discountPercent > 0 ? basePrice / (1 - Math.min(discountPercent, 99) / 100) : null;
  const reviewCount = product.reviewsCount ?? product.reviews?.length ?? 0;
  const categoryLabel = product.categories?.length ? product.categories.join(", ") : "-";
  const productCode = product.sku || product.slug || product.id || "-";

  return (
    <QuickViewModal>
      <Box position="relative" sx={{ backgroundColor: "#f7f4ea", paddingTop: "24px" }}>
        <ImageCarousel images={product.images!} title={product.title} />
      </Box>

      <Box py={3} px={4}>
        {/* TITLE */}
        <Typography
          variant="h6"
          sx={{ fontSize: 18, fontWeight: 700, color: "#1f2a1a", lineHeight: 1.3, mb: 1.5 }}
        >
          {product.title}
        </Typography>

        {/* PRICE ROW */}
        <Box display="flex" alignItems="baseline" gap={1.5} mb={1.5}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#3d6b2a" }}>
            {currency(basePrice)}
          </Typography>
          {comparePrice && (
            <Typography
              sx={{ fontSize: 15, fontWeight: 400, color: "text.disabled", textDecoration: "line-through" }}
            >
              {currency(comparePrice)}
            </Typography>
          )}
          {discountPercent > 0 && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                bgcolor: "#e05c2a",
                borderRadius: 999,
                px: 1,
                py: 0.25,
                lineHeight: 1.6
              }}
            >
              -{discountPercent}%
            </Typography>
          )}
        </Box>

        {/* RATING */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Rating size="small" value={product.rating || 0} readOnly />
          <Typography variant="body2" color="text.secondary">
            ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
          </Typography>
        </Box>

        {/* META PILLS */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Box
            sx={{
              fontSize: 12,
              px: 1.5,
              py: 0.4,
              borderRadius: 999,
              bgcolor: "rgba(111,143,68,0.1)",
              color: "#3d5a20",
              fontWeight: 500
            }}
          >
            {categoryLabel}
          </Box>
          <Box
            sx={{
              fontSize: 12,
              px: 1.5,
              py: 0.4,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.05)",
              color: "text.secondary",
              fontWeight: 500
            }}
          >
            SKU: {productCode}
          </Box>
        </Box>

        {/* DESCRIPTION */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.75, mb: 2.5 }}
        >
          {product?.description ||
            "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus liberpuro ate vol faucibus adipiscing."}
        </Typography>

        {/* SOLD BY */}
        {product.shop && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Sold by:{" "}
            <Link
              href={`/shops/${product.shop.slug}`}
              style={{ fontWeight: 600, color: "#3d6b2a" }}
            >
              {product.shop.name}
            </Link>
          </Typography>
        )}

        <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.07)", pt: 2.5 }}>
          <ButtonGroup product={product} />
        </Box>
      </Box>
    </QuickViewModal>
  );
}
