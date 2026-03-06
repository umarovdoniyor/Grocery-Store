import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
// MUI ICON COMPONENT
import Delete from "@mui/icons-material/Delete";
import Block from "@mui/icons-material/Block";
// GLOBAL CUSTOM COMPONENTS
import BazaarSwitch from "components/BazaarSwitch";
import FlexBox from "components/flex-box/flex-box";
// STYLED COMPONENTS
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";

// ========================================================================
interface Review {
  id: string;
  customer: string;
  product: string;
  comment: string;
  published: boolean;
  status?: string;
  productImage: string;
}

type Props = {
  review: Review;
  isUpdating?: boolean;
  onTogglePublish?: (id: string, checked: boolean) => void;
  onHideReview?: (id: string) => void;
  onRejectReview?: (id: string) => void;
};
// ========================================================================

export default function ReviewRow({
  review,
  isUpdating = false,
  onTogglePublish,
  onHideReview,
  onRejectReview
}: Props) {
  const { id, customer, product, comment, published, productImage } = review;

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar variant="rounded">
            <Image fill alt={product} src={productImage} sizes="(100%, 100%)" />
          </Avatar>

          <Typography variant="h6">{product}</Typography>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">{customer}</StyledTableCell>
      <StyledTableCell align="left">{comment}</StyledTableCell>

      <StyledTableCell align="left">
        <BazaarSwitch
          color="info"
          checked={published}
          disabled={isUpdating}
          onChange={() => {
            const next = !published;
            if (onTogglePublish) onTogglePublish(id, next);
          }}
        />
      </StyledTableCell>

      <StyledTableCell align="center">
        <FlexBox alignItems="center" justifyContent="center" gap={0.5}>
          <StyledIconButton disabled={isUpdating} onClick={() => onHideReview?.(id)}>
            <Delete />
          </StyledIconButton>

          <StyledIconButton disabled={isUpdating} onClick={() => onRejectReview?.(id)}>
            <Block />
          </StyledIconButton>
        </FlexBox>
      </StyledTableCell>
    </StyledTableRow>
  );
}
