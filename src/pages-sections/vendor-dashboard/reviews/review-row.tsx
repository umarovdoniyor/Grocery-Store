import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// MUI ICON COMPONENT
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// STYLED COMPONENTS
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";
// CUSTOM DATA MODEL
import { Review } from "./types";

// =============================================================================
type Props = { review: Review };
// =============================================================================

export default function ReviewRow({ review }: Props) {
  const { image, name, customer, comment, rating } = review;

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            variant="rounded"
            src={image}
            alt={name}
            sx={{ width: 44, height: 44, flexShrink: 0 }}
            imgProps={{ loading: "lazy", referrerPolicy: "no-referrer" }}
          />

          <Typography variant="h6">{name}</Typography>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">{customer}</StyledTableCell>

      <StyledTableCell align="left">{comment}</StyledTableCell>

      <StyledTableCell align="left">
        <Rating value={rating} size="small" color="warning" readOnly />
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton>
          <RemoveRedEye />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
