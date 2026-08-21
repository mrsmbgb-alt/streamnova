"use client";

import { useAppStore } from "@/lib/store";
import { t as translate } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export function useLanguage() {
  const { uiLanguage } = useAppStore();
  const lang = uiLanguage.code as Lang;

  return {
    lang,
    t: (key: string) => translate(lang, key),
  };
}
