import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// MUI ICON COMPONENTS
import Delete from "@mui/icons-material/Delete";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// STYLED COMPONENTS
import { StatusWrapper, StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";

const DEFAULT_CUSTOMER_AVATAR = "/assets/images/faces/propic(1).png";

// ========================================================================
type Props = {
  customer: any;
  uiMode?: "vendor" | "admin";
  isUpdating?: boolean;
  onToggleMemberStatus: (customer: any) => void;
  onSoftDeleteMember: (customer: any) => void;
};
// ========================================================================

export default function CustomerRow({
  customer,
  uiMode = "vendor",
  isUpdating,
  onToggleMemberStatus,
  onSoftDeleteMember
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const accentSoft = uiMode === "admin" ? "rgba(79, 70, 229, 0.08)" : "rgba(20, 184, 166, 0.08)";

  const { email, name, phone, avatar, balance, orders, memberType, memberStatus } = customer;

  const statusLabel = memberStatus === "ACTIVE" ? "Accepted" : "Rejected";
  const actionLabel = memberStatus === "ACTIVE" ? "Suspend" : "Activate";

  const STYLE = { fontWeight: 400 };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            variant="rounded"
            src={avatar}
            alt={name}
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              backgroundColor: "#F8FAFC"
            }}
            imgProps={{
              loading: "lazy",
              onError: (event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = DEFAULT_CUSTOMER_AVATAR;
              }
            }}
          />

          <Typography variant="h6">{name}</Typography>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left" sx={STYLE}>
        {phone}
      </StyledTableCell>

      <StyledTableCell align="left" sx={STYLE}>
        {email}
      </StyledTableCell>

      <StyledTableCell align="left" sx={STYLE}>
        {currency(balance)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={STYLE}>
        {orders}
      </StyledTableCell>

      <StyledTableCell align="left" sx={STYLE}>
        {memberType || "-"}
      </StyledTableCell>

      <StyledTableCell align="left" sx={STYLE}>
        <StatusWrapper status={statusLabel}>{memberStatus}</StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        <Button
          size="small"
          variant="outlined"
          loading={Boolean(isUpdating)}
          disabled={Boolean(isUpdating)}
          onClick={() => onToggleMemberStatus(customer)}
          sx={{
            color: accentDark,
            borderColor: accentColor,
            "&:hover": {
              borderColor: accentDark,
              backgroundColor: accentSoft
            }
          }}
        >
          {actionLabel}
        </Button>

        <StyledIconButton
          disabled={Boolean(isUpdating)}
          onClick={() => onSoftDeleteMember(customer)}
        >
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
