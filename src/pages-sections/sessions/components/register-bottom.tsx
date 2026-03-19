"use client";

import { useSearchParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";
import BoxLink from "./box-link";

export default function RegisterBottom() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const sanitizeNextPath = (value?: string | null) => {
    if (!value) return "";

    let candidate = value.trim();
    for (let i = 0; i < 3; i += 1) {
      if (!/%[0-9A-Fa-f]{2}/.test(candidate)) break;
      try {
        const decoded = decodeURIComponent(candidate);
        if (decoded === candidate) break;
        candidate = decoded;
      } catch {
        break;
      }
    }

    if (!candidate.startsWith("/") || candidate.startsWith("//")) return "";
    const pathOnly = candidate.split("?")[0];
    if (pathOnly === "/login" || pathOnly === "/register" || pathOnly === "/reset-password") {
      return "";
    }

    return candidate;
  };

  const safeNextPath = sanitizeNextPath(nextParam);
  const encodedNext = safeNextPath ? encodeURIComponent(safeNextPath) : "";
  const loginHref = encodedNext ? `/login?next=${encodedNext}` : "/login";

  return (
    <FlexRowCenter gap={1} mt={3}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.95rem" }}>
        Already have an account?
      </Typography>

      <BoxLink title="Login" href={loginHref} />
    </FlexRowCenter>
  );
}
