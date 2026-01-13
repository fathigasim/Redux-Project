import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // ← Load translations from JSON files
  .use(LanguageDetector) // ← Detect user language
  .use(initReactI18next) // ← Pass i18n instance to react-i18next
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    
    ns: ["navbar", "translation"],
    defaultNS: "translation",
    
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    
    detection: {
      order: ["localStorage", "navigator"], // Check localStorage first, then browser
      caches: ["localStorage"], // Save detected language to localStorage
      lookupLocalStorage: "lang", // ← Match the key you use in useBootstrapDirection
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: true, // ← Enable Suspense (optional but recommended)
    },

    // Remove debug in production
    debug: process.env.NODE_ENV === "development",
  });

export default i18n;