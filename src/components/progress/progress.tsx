"use client";

import NextTopLoader from "nextjs-toploader";

export default function ProgressBar() {
  return (
    <NextTopLoader
      height={3}
      shadow={false}
      showSpinner={true}
      color="#111827"
    />
  );
}
