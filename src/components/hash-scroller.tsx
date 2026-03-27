"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scrolls to the #hash element after page content mounts.
// Needed because loading.tsx skeletons render before the target element
// exists, so Next.js's built-in hash scroll fires too early and misses.
export default function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);

    // rAF ensures the DOM has painted before we attempt the scroll
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
