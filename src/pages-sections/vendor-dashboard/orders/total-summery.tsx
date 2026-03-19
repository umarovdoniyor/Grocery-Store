import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// ==============================================================
interface Props {
  total: number;
  discount: number;
  uiMode?: "vendor" | "admin";
}
// ==============================================================

export default function TotalSummery({ total, discount, uiMode = "vendor" }: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";

  return (
    <Card
      sx={{
        px: 3,
        py: 4,
        borderRadius: "10px",
        border: "1px solid #D1D5DB",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, color: "#1F2937" }}>
        Total Summary
      </Typography>

      <FlexBetween mb={1.5}>
        <Typography variant="body1" sx={{ color: "#6B7280" }}>
          Subtotal:
        </Typography>
        <Typography variant="h6" sx={{ color: "#1F2937" }}>
          {currency(total)}
        </Typography>
      </FlexBetween>

      <FlexBetween mb={1.5}>
        <Typography variant="body1" sx={{ color: "#6B7280" }}>
          Shipping fee:
        </Typography>

        <FlexBox alignItems="center" gap={1} maxWidth={100}>
          <p style={{ color: "#6B7280" }}>$</p>
          <TextField
            defaultValue={10}
            type="number"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#D1D5DB"
                },
                "&:hover fieldset": {
                  borderColor: accentColor
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentColor
                }
              }
            }}
          />
        </FlexBox>
      </FlexBetween>

      <FlexBetween mb={1.5}>
        <Typography variant="body1" sx={{ color: "#6B7280" }}>
          Discount(%):
        </Typography>

        <FlexBox alignItems="center" gap={1} maxWidth={100}>
          <p style={{ color: "#6B7280" }}>$</p>
          <TextField
            defaultValue={discount}
            type="number"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#D1D5DB"
                },
                "&:hover fieldset": {
                  borderColor: accentColor
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentColor
                }
              }
            }}
          />
        </FlexBox>
      </FlexBetween>

      <Divider sx={{ my: 2, borderColor: "#E5E7EB" }} />

      <FlexBetween mb={2}>
        <Typography variant="h6" sx={{ color: "#1F2937" }}>
          Total
        </Typography>
        <Typography variant="h6" sx={{ color: accentDark }}>
          {currency(total)}
        </Typography>
      </FlexBetween>

      <p style={{ color: "#6B7280", margin: 0 }}>Paid with Demo Payment</p>
    </Card>
  );
}
