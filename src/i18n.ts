import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(LanguageDetector) // detects browser or saved language
  .use(initReactI18next).use(Backend) // passes i18n down to react-i18next
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    ns: ["navbar", "translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // 👈 correct path
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    // resources: {
    //   en: {
    //     translation: {
    //       "Add Product": "Add Product",
    //       "Name is required": "Name is required",
    //       "Price is required": "Price is required",
    //       "Unexpected error": "Unexpected error",
    //       "Filters":"Filter Query"
    //     },
    //   },
    //   ar: {
    //     translation: {
    //       "Add Product": "إضافة المنتج",
    //       "Name is required": "الاسم مطلوب",
    //       "Price is required": "السعر مطلوب",
    //       "Unexpected error": "خطأ غير متوقع",
    //       "Filters":"تصفية",
    //       "SAR":"ريال سعودي"
    //     },
    //   },
    // },
  });

export default i18n;
