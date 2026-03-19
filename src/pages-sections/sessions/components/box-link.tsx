import Link from "next/link";
import Box from "@mui/material/Box";

// ==============================================================
interface Props {
  title: string;
  href: string;
}
// ==============================================================

export default function BoxLink({ href, title }: Props) {
  return (
    <Link href={href}>
      <Box
        fontWeight={600}
        color="#4f6d2f"
        borderBottom="2px solid #4f6d2f"
        sx={{
          cursor: "pointer",
          transition: "all 220ms ease",
          "&:hover": {
            color: "#446127",
            borderBottomColor: "#446127"
          }
        }}
      >
        {title}
      </Box>
    </Link>
  );
}
