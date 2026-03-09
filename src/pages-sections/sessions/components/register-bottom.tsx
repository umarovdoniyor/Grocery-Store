"use client";

import { useSearchParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";
import BoxLink from "./box-link";

export default function RegisterBottom() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const encodedNext = nextParam && nextParam.startsWith("/") ? encodeURIComponent(nextParam) : "";
  const loginHref = encodedNext ? `/login?next=${encodedNext}` : "/login";

  return (
    <FlexRowCenter gap={1} mt={3}>
      <Typography variant="body2" color="text.secondary">
        Already have an account?
      </Typography>

      <BoxLink title="Login" href={loginHref} />
    </FlexRowCenter>
  );
}
