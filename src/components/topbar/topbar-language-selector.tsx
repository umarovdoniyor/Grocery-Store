"use client";

import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import TouchRipple from "@mui/material/ButtonBase";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import BazaarMenu from "components/BazaarMenu";

// ==============================================================
interface LanguageOption {
  [key: string]: { title: string; value: string };
}
// ==============================================================

export function TopbarLanguageSelector({ languages }: { languages: LanguageOption }) {
  const { i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("preferred_language", lang);
    }
  };

  const activeLanguage = i18n.language.split("-")[0];
  const selectedLanguage = isMounted ? languages[activeLanguage] || languages.en : languages.en;

  return (
    <BazaarMenu
      handler={(e) => (
        <TouchRipple onClick={e} sx={{ svg: { fontSize: 16 }, span: { fontSize: 13 } }}>
          <span>{selectedLanguage.title}</span>
          <ExpandMore fontSize="small" />
        </TouchRipple>
      )}
      options={(onClose) => {
        return Object.keys(languages).map((lang) => (
          <MenuItem
            key={languages[lang].title}
            onClick={() => {
              handleChangeLanguage(lang);
              onClose();
            }}
          >
            {languages[lang].title}
          </MenuItem>
        ));
      }}
    />
  );
}
