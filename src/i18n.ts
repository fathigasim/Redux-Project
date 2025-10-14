import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // detects browser or saved language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          "Add Product": "Add Product",
          "Name is required": "Name is required",
          "Price is required": "Price is required",
          "Unexpected error": "Unexpected error",
          "Filters":"Filter Query"
        },
      },
      ar: {
        translation: {
          "Add Product": "إضافة المنتج",
          "Name is required": "الاسم مطلوب",
          "Price is required": "السعر مطلوب",
          "Unexpected error": "خطأ غير متوقع",
          "Filters":"تصفية"
        },
      },
    },
  });

export default i18n;
