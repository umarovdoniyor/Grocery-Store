import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f7f4ea",
        border: "1px solid rgba(90, 112, 64, 0.12)"
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 1.5, fontWeight: 700, color: "#1f2a1a", fontSize: 16 }}
      >
        Product Description
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "text.secondary", whiteSpace: "pre-line", lineHeight: 1.8 }}
      >
        {description?.trim() || "No product description available."}
      </Typography>
    </Box>
  );
}
