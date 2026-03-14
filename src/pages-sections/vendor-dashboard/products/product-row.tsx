import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
// MUI ICON COMPONENTS
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import Done from "@mui/icons-material/Done";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
import BazaarSwitch from "components/BazaarSwitch";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// STYLED COMPONENTS
import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton } from "../styles";

// ========================================================================
export interface ProductRowItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  brand: string;
  image: string;
  category: string;
  published: boolean;
  featured?: boolean;
  featuredRank?: number | null;
}

type RowProps = {
  product: ProductRowItem;
  basePath?: string;
  isUpdating?: boolean;
  isUpdatingFeatured?: boolean;
  isRemoving?: boolean;
  showFeaturedToggle?: boolean;
  onTogglePublished: (product: ProductRowItem) => void;
  onToggleFeatured?: (product: ProductRowItem) => void;
  onUpdateFeaturedRank?: (product: ProductRowItem, featuredRank: number) => void;
  onRemoveProduct: (product: ProductRowItem) => void;
};
// ========================================================================

export default function ProductRow({
  product,
  basePath = "/admin/products",
  isUpdating,
  isUpdatingFeatured,
  isRemoving,
  showFeaturedToggle = false,
  onTogglePublished,
  onToggleFeatured,
  onUpdateFeaturedRank,
  onRemoveProduct
}: RowProps) {
  const { category, name, price, image, brand, id, published, featured, featuredRank, slug } =
    product;
  const isBrandImage = brand?.startsWith("/") || brand?.startsWith("http");
  const [rankDraft, setRankDraft] = useState(
    featuredRank && Number.isFinite(Number(featuredRank)) ? String(featuredRank) : ""
  );

  useEffect(() => {
    setRankDraft(featuredRank && Number.isFinite(Number(featuredRank)) ? String(featuredRank) : "");
  }, [featuredRank]);

  const applyFeaturedRank = () => {
    if (!featured) return;

    const parsedRank = Number(rankDraft);
    if (!Number.isInteger(parsedRank) || parsedRank < 1) return;

    if (parsedRank === Number(featuredRank || 0)) return;
    onUpdateFeaturedRank?.(product, parsedRank);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar variant="rounded">
            <Image fill src={image} alt={name} sizes="(100%, 100%)" />
          </Avatar>

          <div>
            <Typography variant="h6">{name}</Typography>

            <Typography variant="body1" sx={{ fontSize: 13, color: "grey.600" }}>
              #{id.split("-")[0]}
            </Typography>
          </div>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{category}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">
        {isBrandImage ? (
          <Box sx={{ width: 55, height: 25, position: "relative", img: { objectFit: "contain" } }}>
            <Image fill src={brand} alt={name} sizes="(55px, 25px)" />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "grey.700" }}>
            {brand || "-"}
          </Typography>
        )}
      </StyledTableCell>

      <StyledTableCell align="left">{currency(price)}</StyledTableCell>

      <StyledTableCell align="left">
        {isUpdating ? (
          <CircularProgress size={18} color="info" />
        ) : (
          <BazaarSwitch
            color="info"
            checked={published}
            onChange={() => onTogglePublished(product)}
          />
        )}
      </StyledTableCell>

      {showFeaturedToggle && (
        <StyledTableCell align="left">
          <FlexBox alignItems="center" gap={1}>
            {isUpdatingFeatured ? (
              <CircularProgress size={18} color="warning" />
            ) : (
              <BazaarSwitch
                color="warning"
                checked={Boolean(featured)}
                onChange={() => onToggleFeatured?.(product)}
              />
            )}

            <TextField
              size="small"
              type="number"
              placeholder="Rank"
              value={rankDraft}
              onChange={(event) => setRankDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyFeaturedRank();
                }
              }}
              onBlur={applyFeaturedRank}
              disabled={!featured || isUpdatingFeatured}
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ width: 90 }}
            />

            <StyledIconButton
              onClick={applyFeaturedRank}
              disabled={!featured || isUpdatingFeatured || !rankDraft.trim()}
            >
              <Done />
            </StyledIconButton>
          </FlexBox>
        </StyledTableCell>
      )}

      <StyledTableCell align="center">
        <Link href={`${basePath}/${slug}`}>
          <StyledIconButton>
            <Edit />
          </StyledIconButton>
        </Link>

        <StyledIconButton>
          <RemoveRedEye />
        </StyledIconButton>

        {isRemoving ? (
          <CircularProgress size={18} color="error" />
        ) : (
          <StyledIconButton onClick={() => onRemoveProduct(product)}>
            <Delete />
          </StyledIconButton>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
}
