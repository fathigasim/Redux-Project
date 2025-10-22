import { useEffect } from "react";
import i18next from "i18next";

export function useBootstrapDirection() {
  useEffect(() => {
    // Load last saved language from localStorage (if exists)
    const savedLang = localStorage.getItem("lang");
    if (savedLang && i18next.language !== savedLang) {
      i18next.changeLanguage(savedLang);
    }

    const updateDirection = (lang:any) => {
      const isRTL = lang === "ar";

      // Save language to localStorage
      localStorage.setItem("lang", lang);

      // Remove existing bootstrap CSS
      const head = document.head;
      const existingLink = document.getElementById("bootstrap-css");
      if (existingLink) head.removeChild(existingLink);

      // Add the proper Bootstrap CSS file (RTL or LTR)
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = "bootstrap-css";
      link.href = isRTL
        ? "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css"
        : "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      link.crossOrigin = "anonymous";
      head.appendChild(link);

      // Set direction
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.body.dir = isRTL ? "rtl" : "ltr";

      // Optional helper classes
      document.body.classList.remove("rtl", "ltr");
      document.body.classList.add(isRTL ? "rtl" : "ltr");

      // Optional inline text direction
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
