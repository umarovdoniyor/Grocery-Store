import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { format } from "date-fns/format";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

// ==============================================================
interface Props {
  id: string;
  status: string;
  createdAt: Date;
  uiMode?: "vendor" | "admin";
}
// ==============================================================

const getColor = (status: string) => {
  if (status === "Pending") return "secondary" as const;
  if (status === "Processing") return "info" as const;
  if (status === "Delivered") return "success" as const;
  if (status === "Cancelled") return "error" as const;
  return "default" as const;
};

export default function OrderActions({ id, createdAt, status, uiMode = "vendor" }: Props) {
  const successBg = uiMode === "admin" ? "#E0E7FF" : "#CCFBF1";
  const successColor = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const infoBg = uiMode === "admin" ? "#E0E7FF" : "#CFFAFE";
  const infoColor = uiMode === "admin" ? "#4338CA" : "#155E75";

  return (
    <div>
      <FlexBox flexWrap="wrap" alignItems="center" columnGap={4} rowGap={1}>
        <Typography variant="body1" sx={{ color: "#1F2937", span: { color: "#6B7280" } }}>
          <span>Order ID:</span> {id}
        </Typography>

        <Typography variant="body1" sx={{ color: "#1F2937", span: { color: "#6B7280" } }}>
          <span>Placed on:</span> {format(new Date(createdAt), "dd MMM, yyyy")}
        </Typography>

        <Typography variant="body1" sx={{ color: "#1F2937", span: { color: "#6B7280" } }}>
          <span>Current status:</span>{" "}
          <Chip
            size="small"
            label={status}
            color={getColor(status)}
            sx={{
              ml: 1,
              borderRadius: "6px",
              "&.MuiChip-colorSuccess": {
                backgroundColor: successBg,
                color: successColor
              },
              "&.MuiChip-colorInfo": {
                backgroundColor: infoBg,
                color: infoColor
              },
              "&.MuiChip-colorSecondary": {
                backgroundColor: "#E5E7EB",
                color: "#4B5563"
              },
              "&.MuiChip-colorError": {
                backgroundColor: "#FEE2E2",
                color: "#B91C1C"
              }
            }}
          />
        </Typography>
      </FlexBox>
    </div>
  );
}
