import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

// ==============================================================
type Props = { address: string };
// ==============================================================

export default function ShippingAddress({ address }: Props) {
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
      <TextField
        rows={5}
        multiline
        fullWidth
        variant="outlined"
        label="Shipping Address"
        defaultValue={address}
        sx={{
          mb: 4,
          "& .MuiInputLabel-root": {
            zIndex: 1,
            color: "#6B7280"
          },
          "& .MuiInputLabel-shrink": {
            px: 0.5,
            bgcolor: "#F8FAFC"
          },
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

      <TextField
        rows={5}
        multiline
        fullWidth
        variant="outlined"
        label="Customer’s Note"
        defaultValue="Please deliver ASAP."
        sx={{
          "& .MuiInputLabel-root": {
            zIndex: 1,
            color: "#6B7280"
          },
          "& .MuiInputLabel-shrink": {
            px: 0.5,
            bgcolor: "#F8FAFC"
          },
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
    </Card>
  );
}
