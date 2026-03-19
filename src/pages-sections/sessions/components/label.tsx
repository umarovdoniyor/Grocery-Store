import FormLabel, { FormLabelProps } from "@mui/material/FormLabel";

export default function Label({ children }: FormLabelProps) {
  return (
    <FormLabel
      sx={{
        mb: 1,
        fontSize: "0.9rem",
        fontWeight: 600,
        display: "block",
        color: "#446127",
        letterSpacing: "0.2px"
      }}
    >
      {children}
    </FormLabel>
  );
}
