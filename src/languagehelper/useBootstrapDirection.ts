import { useEffect } from "react";
import i18next from "i18next";

type LanguageCode = "en" | "ar" | string;

export function useBootstrapDirection() {
  useEffect(() => {
    const updateDirection = (lang: LanguageCode) => {
      const isRTL = lang === "ar";

      // i18next-browser-languagedetector already saves to localStorage("lang")
      // so we don't need to manually do it here anymore ✅

      // Remove existing bootstrap CSS (if any)
      const head = document.head;
      const existingLink = document.getElementById("bootstrap-css");
      if (existingLink?.parentNode) {
        existingLink.parentNode.removeChild(existingLink);
      }

      // Add the proper Bootstrap CSS file (RTL or LTR)
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = "bootstrap-css";
      link.href = isRTL
        ? "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css"
        : "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      link.crossOrigin = "anonymous";
      head.appendChild(link);

      // Set document direction
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.body.dir = isRTL ? "rtl" : "ltr";

      // Optional helper classes
      document.body.classList.remove("rtl", "ltr");
      document.body.classList.add(isRTL ? "rtl" : "ltr");

      // Optional text alignment
      document.body.style.textAlign = isRTL ? "right" : "left";
    };

    // Initial direction on load
    updateDirection(i18next.language);

    // Listen to language changes globally
    i18next.on("languageChanged", updateDirection);

    // Cleanup
    return () => {
      i18next.off("languageChanged", updateDirection);
    };
  }, []);
}