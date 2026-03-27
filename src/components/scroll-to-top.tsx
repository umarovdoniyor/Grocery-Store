"use client";
import { useEffect } from "react";

// Scrolls to the top of the page on mount.
// Needed on product detail pages because the shared root layout preserves
// the scroll position from the previous page when Suspense (loading.tsx)
// boundaries are involved in the navigation.
export default function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
