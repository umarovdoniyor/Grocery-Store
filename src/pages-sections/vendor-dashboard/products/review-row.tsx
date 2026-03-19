import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
// MUI ICON COMPONENT
import Delete from "@mui/icons-material/Delete";
import Block from "@mui/icons-material/Block";
import CheckCircle from "@mui/icons-material/CheckCircle";
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
  uiMode?: "vendor" | "admin";
  isUpdating?: boolean;
  onTogglePublish?: (id: string, checked: boolean) => void;
  onHideReview?: (id: string) => void;
  onRejectReview?: (id: string) => void;
  onQuickApprove?: (id: string) => void;
};
// ========================================================================

export default function ReviewRow({
  review,
  uiMode = "vendor",
  isUpdating = false,
  onTogglePublish,
  onHideReview,
  onRejectReview,
  onQuickApprove
}: Props) {
  const isAdminMode = uiMode === "admin";
  const accentMain = isAdminMode ? "#4F46E5" : "#14B8A6";
  const accentDark = isAdminMode ? "#4338CA" : "#0F766E";

  const { id, customer, product, comment, published, productImage } = review;

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
            <Image fill alt={product} src={productImage} sizes="(100%, 100%)" />
          </Avatar>

          <Typography variant="h6" sx={{ color: "#1F2937" }}>
            {product}
          </Typography>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">
        <Typography variant="body2" sx={{ color: "#374151" }}>
          {customer}
        </Typography>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          {comment}
        </Typography>
      </StyledTableCell>

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
          <StyledIconButton
            disabled={isUpdating || published}
            title="Quick Approve"
            onClick={() => onQuickApprove?.(id)}
            sx={{
              color: accentDark,
              borderColor: accentMain,
              backgroundColor: isAdminMode ? "#EEF2FF" : "#F0FDFA",
              "&:hover": {
                borderColor: accentDark,
                backgroundColor: isAdminMode ? "#E0E7FF" : "#CCFBF1"
              }
            }}
          >
            <CheckCircle />
          </StyledIconButton>

          <StyledIconButton
            disabled={isUpdating}
            onClick={() => onHideReview?.(id)}
            sx={{
              color: "#B45309",
              borderColor: "#F59E0B",
              backgroundColor: "#FFFBEB",
              "&:hover": {
                borderColor: "#D97706",
                backgroundColor: "#FEF3C7"
              }
            }}
          >
            <Delete />
          </StyledIconButton>

          <StyledIconButton
            disabled={isUpdating}
            onClick={() => onRejectReview?.(id)}
            sx={{
              color: "#991B1B",
              borderColor: "#FCA5A5",
              backgroundColor: "#FEF2F2",
              "&:hover": {
                borderColor: "#EF4444",
                backgroundColor: "#FEE2E2"
              }
            }}
          >
            <Block />
          </StyledIconButton>
        </FlexBox>
      </StyledTableCell>
    </StyledTableRow>
  );
}
