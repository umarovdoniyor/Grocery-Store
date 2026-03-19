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
}
// ==============================================================

export default function TotalSummery({ total, discount }: Props) {
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
                  borderColor: "#14B8A6"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#14B8A6"
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
                  borderColor: "#14B8A6"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#14B8A6"
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
        <Typography variant="h6" sx={{ color: "#0F766E" }}>
          {currency(total)}
        </Typography>
      </FlexBetween>

      <p style={{ color: "#6B7280", margin: 0 }}>Paid with Demo Payment</p>
    </Card>
  );
}
