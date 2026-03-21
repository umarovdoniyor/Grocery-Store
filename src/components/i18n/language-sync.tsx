"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyPreferredLanguage = () => {
      const preferredLanguage = window.localStorage.getItem("preferred_language");
      const normalized = preferredLanguage?.split("-")[0] || "en";

      if (normalized !== i18n.language.split("-")[0]) {
        i18n.changeLanguage(normalized);
      }

      document.documentElement.lang = normalized;
    };

    applyPreferredLanguage();
    window.addEventListener("storage", applyPreferredLanguage);

    return () => {
      window.removeEventListener("storage", applyPreferredLanguage);
    };
  }, [i18n]);

  return null;
}
