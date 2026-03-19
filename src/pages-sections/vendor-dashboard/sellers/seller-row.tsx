import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { toPublicImageUrl } from "../../../../libs/upload";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// STYLED COMPONENTS
import { StatusWrapper, StyledTableCell, StyledTableRow } from "../styles";
// DATA TYPES
import { Seller } from "./types";

const DEFAULT_SELLER_IMAGE = "/assets/images/faces/propic(1).png";

const getApiBaseUrl = () => {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
};

const resolveSellerDisplayImage = (value?: string | null) => {
  const normalized = value?.replace(/\\/g, "/").trim();
  if (!normalized) return DEFAULT_SELLER_IMAGE;

  if (normalized.startsWith("/assets/")) return normalized;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const parsed = new URL(normalized);
      return parsed.host ? normalized : DEFAULT_SELLER_IMAGE;
    } catch {
      return DEFAULT_SELLER_IMAGE;
    }
  }

  try {
    return toPublicImageUrl(normalized, getApiBaseUrl());
  } catch {
    return DEFAULT_SELLER_IMAGE;
  }
};

// ========================================================================
type Props = {
  seller: Seller;
  uiMode?: "vendor" | "admin";
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

export default function SellerRow({
  seller,
  uiMode = "vendor",
  isUpdating,
  onApproveSeller,
  onRejectSeller
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const accentSoft = uiMode === "admin" ? "rgba(79, 70, 229, 0.08)" : "rgba(20, 184, 166, 0.08)";

  const { name, phone, image, shopName, status, rejectionReason, createdAt, description } = seller;
  const resolvedImage = resolveSellerDisplayImage(image);
  const canReview = status === "PENDING";

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            variant="rounded"
            src={resolvedImage}
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
                target.src = DEFAULT_SELLER_IMAGE;
              }
            }}
          />

          <div>
            <Typography variant="h6" sx={{ color: "#1F2937" }}>
              {name}
            </Typography>
            <Typography variant="body1" sx={{ color: "#6B7280" }}>
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
          <Typography variant="caption" sx={{ color: "#B91C1C" }}>
            {rejectionReason || "Rejected by admin"}
          </Typography>
        ) : (
          <Typography variant="caption" sx={{ color: "#6B7280" }}>
            {description || "No description provided"}
          </Typography>
        )}
      </StyledTableCell>

      <StyledTableCell align="center">
        {isUpdating ? (
          <CircularProgress size={18} sx={{ color: accentColor }} />
        ) : (
          <FlexBox justifyContent="center" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              disabled={!canReview}
              onClick={() => onApproveSeller(seller)}
              sx={{
                backgroundColor: accentColor,
                color: "#F8FAFC",
                "&:hover": {
                  backgroundColor: accentDark
                }
              }}
            >
              Approve
            </Button>

            <Button
              size="small"
              variant="outlined"
              disabled={!canReview}
              onClick={() => onRejectSeller(seller)}
              sx={{
                color: accentDark,
                borderColor: accentColor,
                "&:hover": {
                  borderColor: accentDark,
                  backgroundColor: accentSoft
                }
              }}
            >
              Reject
            </Button>
          </FlexBox>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
}
