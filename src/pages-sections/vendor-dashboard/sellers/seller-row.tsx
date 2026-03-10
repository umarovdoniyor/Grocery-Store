import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// STYLED COMPONENTS
import { StatusWrapper, StyledTableCell, StyledTableRow } from "../styles";
// DATA TYPES
import { Seller } from "./types";

// ========================================================================
type Props = {
  seller: Seller;
  isUpdating?: boolean;
  onApproveSeller: (seller: Seller) => void;
  onRejectSeller: (seller: Seller) => void;
};
// ========================================================================

function formatStatus(status: Seller["status"]) {
  if (status === "APPROVED") return "Accepted";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
}

export default function SellerRow({ seller, isUpdating, onApproveSeller, onRejectSeller }: Props) {
  const { name, phone, image, shopName, status, rejectionReason, createdAt, description } = seller;

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar variant="rounded">
            <Image fill sizes="(100%, 100%)" src={image} alt={name} />
          </Avatar>

          <div>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body1" sx={{ color: "grey.600" }}>
              {phone}
            </Typography>
          </div>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">{shopName}</StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        <StatusWrapper status={formatStatus(status)}>{formatStatus(status)}</StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {new Date(createdAt).toLocaleDateString()}
      </StyledTableCell>

      <StyledTableCell align="left">
        {status === "REJECTED" ? (
          <Typography variant="caption" color="error.main">
            {rejectionReason || "Rejected by admin"}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {description || "No description provided"}
          </Typography>
        )}
      </StyledTableCell>

      <StyledTableCell align="center">
        {isUpdating ? (
          <CircularProgress size={18} color="info" />
        ) : (
          <FlexBox justifyContent="center" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={status === "APPROVED"}
              onClick={() => onApproveSeller(seller)}
            >
              Approve
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={status === "REJECTED"}
              onClick={() => onRejectSeller(seller)}
            >
              Reject
            </Button>
          </FlexBox>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
}
