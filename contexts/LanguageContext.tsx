"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import ar, { Translations } from "@/locales/ar";
import en from "@/locales/en";
import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";
import type { Locale } from "antd/es/locale";

type Language = "ar" | "en";

type LanguageContextType = {
  language: Language;
  t: Translations;
  antLocale: Locale;
  isRTL: boolean;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  t: ar,
  antLocale: arEG,
  isRTL: true,
  toggleLanguage: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language | null;
    const lang: Language = stored === "en" ? "en" : "ar";
    setLanguage(lang);
    applyLanguage(lang);
  }, []);

  const applyLanguage = (lang: Language) => {
    const html = document.documentElement;
    if (lang === "ar") {
      html.setAttribute("dir", "rtl");
      html.setAttribute("lang", "ar");
    } else {
      html.setAttribute("dir", "ltr");
      html.setAttribute("lang", "en");
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === "ar" ? "en" : "ar";
      applyLanguage(next);
      localStorage.setItem("language", next);
      return next;
    });
  };

  const isRTL = language === "ar";
  const t = language === "ar" ? ar : en;
  const antLocale = language === "ar" ? arEG : enUS;

  return (
    <LanguageContext.Provider
      value={{ language, t, antLocale, isRTL, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
