import Link from "next/link";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// DUMMY CUSTOM DATA
import countryList from "data/countryList";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

const STATE_LIST = [
  { value: "new-york", label: "New York" },
  { value: "chicago", label: "Chicago" }
];

export default function CheckoutForm() {
  const { state } = useCart();

  const getTotalPrice = () => state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Card
      elevation={0}
      sx={{
        padding: 3,
        border: "1px solid rgba(79,109,47,0.22)",
        borderRadius: 2,
        backgroundColor: "#FEFDF9",
        boxShadow: "0 8px 18px rgba(33,49,26,0.08)",
        "& .MuiInputLabel-root": {
          zIndex: 1,
          color: "#5E6F4D"
        },
        "& .MuiInputLabel-shrink": {
          px: 0.5,
          borderRadius: 0.5,
          bgcolor: "#FEFDF9"
        }
      }}
    >
      <Typography variant="h6" sx={{ color: "#2F4022", fontWeight: 700, mb: 2 }}>
        Order Summary
      </Typography>

      <FlexBetween mb={2}>
        <Typography variant="body1" fontSize={16} fontWeight={600}>
          Total:
        </Typography>

        <Typography variant="body1" fontSize={18} fontWeight={600} lineHeight={1}>
          {currency(getTotalPrice())}
        </Typography>
      </FlexBetween>

      <Divider sx={{ mb: 2 }} />

      <FlexBox alignItems="center" columnGap={1} mb={2}>
        <Typography variant="body1" fontWeight={500}>
          Additional Comments
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: 12,
            lineHeight: 1,
            padding: "2px 6px",
            borderRadius: "3px",
            bgcolor: "grey.200"
          }}
        >
          Note
        </Typography>
      </FlexBox>

      {/* COMMENTS TEXT FIELD */}
      <TextField
        variant="outlined"
        rows={3}
        fullWidth
        multiline
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#F7F4EA",
            "& fieldset": { borderColor: "rgba(79,109,47,0.2)" },
            "&:hover fieldset": { borderColor: "rgba(79,109,47,0.35)" },
            "&.Mui-focused fieldset": { borderColor: "#5A7A30" }
          }
        }}
      />

      {/* APPLY VOUCHER TEXT FIELD */}
      <FlexBox alignItems="center" gap={1} my={2}>
        <TextField
          fullWidth
          size="small"
          label="Voucher"
          variant="outlined"
          placeholder="Voucher"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F7F4EA",
              "& fieldset": { borderColor: "rgba(79,109,47,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(79,109,47,0.35)" },
              "&.Mui-focused fieldset": { borderColor: "#5A7A30" }
            }
          }}
        />

        <Button
          variant="outlined"
          sx={{
            borderColor: "rgba(79,109,47,0.35)",
            color: "#446127",
            "&:hover": {
              borderColor: "#446127",
              backgroundColor: "rgba(79,109,47,0.08)"
            }
          }}
        >
          Apply
        </Button>
      </FlexBox>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
        Shipping Estimates
      </Typography>

      {/* COUNTRY TEXT FIELD */}
      <TextField
        select
        fullWidth
        size="small"
        label="Country"
        variant="outlined"
        placeholder="Select Country"
        defaultValue="US"
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#F7F4EA",
            "& fieldset": { borderColor: "rgba(79,109,47,0.2)" },
            "&:hover fieldset": { borderColor: "rgba(79,109,47,0.35)" },
            "&.Mui-focused fieldset": { borderColor: "#5A7A30" }
          }
        }}
      >
        {countryList.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      {/* STATE/CITY TEXT FIELD */}
      <TextField
        select
        fullWidth
        size="small"
        label="State"
        variant="outlined"
        placeholder="Select State"
        defaultValue="new-york"
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#F7F4EA",
            "& fieldset": { borderColor: "rgba(79,109,47,0.2)" },
            "&:hover fieldset": { borderColor: "rgba(79,109,47,0.35)" },
            "&.Mui-focused fieldset": { borderColor: "#5A7A30" }
          }
        }}
      >
        {STATE_LIST.map(({ label, value }) => (
          <MenuItem value={value} key={label}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      {/* ZIP-CODE TEXT FIELD */}
      <TextField
        fullWidth
        size="small"
        label="Zip Code"
        placeholder="3100"
        variant="outlined"
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#F7F4EA",
            "& fieldset": { borderColor: "rgba(79,109,47,0.2)" },
            "&:hover fieldset": { borderColor: "rgba(79,109,47,0.35)" },
            "&.Mui-focused fieldset": { borderColor: "#5A7A30" }
          }
        }}
      />

      <Button
        variant="outlined"
        fullWidth
        sx={{
          my: 2,
          borderColor: "rgba(79,109,47,0.35)",
          color: "#446127",
          "&:hover": {
            borderColor: "#446127",
            backgroundColor: "rgba(79,109,47,0.08)"
          }
        }}
      >
        Calculate Shipping
      </Button>

      <Button
        fullWidth
        href="/checkout"
        variant="contained"
        LinkComponent={Link}
        sx={{
          backgroundColor: "#5A7A30",
          "&:hover": {
            backgroundColor: "#446127"
          }
        }}
      >
        Checkout Now
      </Button>
    </Card>
  );
}
