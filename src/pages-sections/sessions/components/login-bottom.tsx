"use client";

import { Fragment } from "react";
import { useSearchParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import BoxLink from "./box-link";

export default function LoginBottom() {
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
  const registerHref = encodedNext ? `/register?next=${encodedNext}` : "/register";
  const resetHref = encodedNext ? `/reset-password?next=${encodedNext}` : "/reset-password";

  return (
    <Fragment>
      <FlexRowCenter gap={1} my={3}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have account?
        </Typography>

        <BoxLink title="Register" href={registerHref} />
      </FlexRowCenter>

      <FlexBox gap={1} py={2} borderRadius={1} justifyContent="center" bgcolor="grey.50">
        <Typography variant="body2" color="text.secondary">
          Forgot your password?
        </Typography>

        <BoxLink title="Reset It" href={resetHref} />
      </FlexBox>
    </Fragment>
  );
}
