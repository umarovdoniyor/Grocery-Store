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
}
// ==============================================================

const getColor = (status: string) => {
  if (status === "Pending") return "secondary" as const;
  if (status === "Processing") return "info" as const;
  if (status === "Delivered") return "success" as const;
  if (status === "Cancelled") return "error" as const;
  return "default" as const;
};

export default function OrderActions({ id, createdAt, status }: Props) {
  return (
    <div>
      <FlexBox flexWrap="wrap" alignItems="center" columnGap={4} rowGap={1}>
        <Typography variant="body1" sx={{ span: { color: "grey.600" } }}>
          <span>Order ID:</span> {id}
        </Typography>

        <Typography variant="body1" sx={{ span: { color: "grey.600" } }}>
          <span>Placed on:</span> {format(new Date(createdAt), "dd MMM, yyyy")}
        </Typography>

        <Typography variant="body1" sx={{ span: { color: "grey.600" } }}>
          <span>Current status:</span>{" "}
          <Chip size="small" label={status} color={getColor(status)} sx={{ ml: 1 }} />
        </Typography>
      </FlexBox>
    </div>
  );
}
