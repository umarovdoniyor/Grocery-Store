"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledChip } from "./styles";

interface Props {
  label: string;
  title: string;
}

export default function TopbarLeftTranslatedText({ label, title }: Props) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resolvedLabel = isMounted ? t(label) : label;
  const resolvedTitle = isMounted ? t(title) : title;

  return (
    <>
      <StyledChip label={resolvedLabel} size="small" />
      <span>{resolvedTitle}</span>
    </>
  );
}
