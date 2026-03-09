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
      <Box position="relative" bgcolor="grey.100">
        <ImageCarousel images={product.images!} title={product.title} />
      </Box>

      <Box py={3} px={4}>
        <Typography variant="body1" fontSize={22} fontWeight={600} sx={{ mb: 1 }}>
          {product.title}
        </Typography>

        <Typography variant="body1" fontSize={22} fontWeight={600}>
          {currency(basePrice)}
          {comparePrice && (
            <Typography
              component="span"
              sx={{
                ml: 1,
                fontSize: 16,
                fontWeight: 500,
                color: "text.secondary",
                textDecoration: "line-through"
              }}
            >
              {currency(comparePrice)}
            </Typography>
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Category: <strong>{categoryLabel}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Product Code: <strong>{productCode}</strong>
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={3} mt={2}>
          <Rating size="small" color="warn" value={product.rating || 0} readOnly />
          <Typography variant="body1" lineHeight="1" color="text.secondary">
            ({reviewCount})
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {product?.description ||
            "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus liberpuro ate vol faucibus adipiscing."}
        </Typography>

        {product.shop && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sold By:{" "}
            <Link href={`/shops/${product.shop.slug}`} style={{ fontWeight: 700 }}>
              {product.shop.name}
            </Link>
          </Typography>
        )}

        <ButtonGroup product={product} />
      </Box>
    </QuickViewModal>
  );
}
