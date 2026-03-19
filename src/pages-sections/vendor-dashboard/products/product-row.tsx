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
  uiMode?: "vendor" | "admin";
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
  uiMode = "vendor",
  isUpdating,
  isUpdatingFeatured,
  isRemoving,
  showFeaturedToggle = false,
  onTogglePublished,
  onToggleFeatured,
  onUpdateFeaturedRank,
  onRemoveProduct
}: RowProps) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";

  const { category, name, price, image, brand, id, published, featured, featuredRank, slug } =
    product;
  const isVisibleOnHome = Boolean(featured && published);
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
          <Avatar
            variant="rounded"
            sx={{
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              backgroundColor: "#F8FAFC"
            }}
          >
            <Image fill src={image} alt={name} sizes="(100%, 100%)" />
          </Avatar>

          <div>
            <Typography variant="h6" sx={{ color: "#1F2937" }}>
              {name}
            </Typography>

            <Typography variant="body1" sx={{ fontSize: 13, color: "#6B7280" }}>
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
          <Typography variant="body2" sx={{ color: "#374151" }}>
            {brand || "-"}
          </Typography>
        )}
      </StyledTableCell>

      <StyledTableCell align="left">{currency(price)}</StyledTableCell>

      <StyledTableCell align="left">
        {isUpdating ? (
          <CircularProgress size={18} sx={{ color: accentColor }} />
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
          <Box>
            <FlexBox alignItems="center" gap={1}>
              {isUpdatingFeatured ? (
                <CircularProgress size={18} sx={{ color: accentDark }} />
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
                sx={{
                  width: 90,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#F8FAFC",
                    "& fieldset": {
                      borderColor: "#D1D5DB"
                    },
                    "&:hover fieldset": {
                      borderColor: accentColor
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: accentColor
                    }
                  }
                }}
              />

              <StyledIconButton
                onClick={applyFeaturedRank}
                disabled={!featured || isUpdatingFeatured || !rankDraft.trim()}
              >
                <Done />
              </StyledIconButton>
            </FlexBox>

            <Typography variant="caption" sx={{ display: "block", mt: 0.75, color: "#6B7280" }}>
              {isVisibleOnHome ? (
                <>
                  Visible on Home.{" "}
                  <Link href="/" target="_blank" style={{ color: accentDark }}>
                    Open
                  </Link>
                </>
              ) : (
                "Hidden on Home (requires Featured + Published)."
              )}
            </Typography>
          </Box>
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
