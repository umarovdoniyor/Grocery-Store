import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
// MUI ICON COMPONENTS
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
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
}

type RowProps = {
  product: ProductRowItem;
  isUpdating?: boolean;
  isRemoving?: boolean;
  onTogglePublished: (product: ProductRowItem) => void;
  onRemoveProduct: (product: ProductRowItem) => void;
};
// ========================================================================

export default function ProductRow({
  product,
  isUpdating,
  isRemoving,
  onTogglePublished,
  onRemoveProduct
}: RowProps) {
  const { category, name, price, image, brand, id, published, slug } = product;
  const isBrandImage = brand?.startsWith("/") || brand?.startsWith("http");

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

      <StyledTableCell align="center">
        <Link href={`/admin/products/${slug}`}>
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
