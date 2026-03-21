"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  subtitle: string;
}

export default function TranslatedHeroCopy({ title, subtitle }: Props) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resolvedTitle = isMounted ? t(title) : title;
  const resolvedSubtitle = isMounted ? t(subtitle) : subtitle;

  return (
    <>
      <h1>{resolvedTitle}</h1>
      <p className="heroSubTitle">{resolvedSubtitle}</p>
    </>
  );
}
