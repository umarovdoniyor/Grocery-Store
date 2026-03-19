import Link from "next/link";
import { format } from "date-fns/format";
import Button from "@mui/material/Button";
// MUI ICON COMPONENTS
import Delete from "@mui/icons-material/Delete";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// STYLED COMPONENTS
import { StatusWrapper, StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";

// ========================================================================
type RowProps = {
  order: any;
  basePath?: string;
  uiMode?: "vendor" | "admin";
  isUpdating?: boolean;
  onMarkDelivered?: (orderId: string) => void;
};
// ========================================================================

export default function OrderRow({
  order,
  basePath = "/admin/orders",
  uiMode = "vendor",
  isUpdating = false,
  onMarkDelivered
}: RowProps) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";

  const { amount, id, qty, purchaseDate, billingAddress, status } = order;
  const canMarkDelivered =
    Boolean(onMarkDelivered) && status !== "Delivered" && status !== "Cancelled";
  const isFinalized = status === "Delivered" || status === "Cancelled";

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>
      <StyledTableCell align="left">{qty}</StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {format(new Date(purchaseDate), "dd MMM yyyy")}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {billingAddress}
      </StyledTableCell>

      <StyledTableCell align="left">{currency(amount)}</StyledTableCell>

      <StyledTableCell align="left">
        <StatusWrapper status={status}>{status}</StatusWrapper>

        {canMarkDelivered ? (
          <Button
            size="small"
            variant="outlined"
            loading={isUpdating}
            onClick={() => onMarkDelivered?.(id)}
            sx={{
              ml: 1,
              minWidth: 120,
              color: accentDark,
              borderColor: accentColor,
              "&:hover": {
                borderColor: accentDark,
                backgroundColor:
                  uiMode === "admin" ? "rgba(79, 70, 229, 0.08)" : "rgba(20, 184, 166, 0.08)"
              }
            }}
          >
            Mark Delivered
          </Button>
        ) : onMarkDelivered && isFinalized ? (
          <Button
            size="small"
            variant="outlined"
            disabled
            sx={{
              ml: 1,
              minWidth: 120,
              borderColor: "#D1D5DB",
              color: "#6B7280"
            }}
          >
            Finalized
          </Button>
        ) : null}
      </StyledTableCell>

      <StyledTableCell align="center">
        <Link href={`${basePath}/${id}`}>
          <StyledIconButton>
            <RemoveRedEye />
          </StyledIconButton>
        </Link>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
