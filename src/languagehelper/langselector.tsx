
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useBootstrapDirection } from "./useBootstrapDirection";

export default function LangSelector() {
  const { i18n, t } = useTranslation("navbar");
  useBootstrapDirection();

  const toggleLanguage = () => {
    const newLang = i18next.language === "ar" ? "en" : "ar";
    i18next.changeLanguage(newLang);
  };

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={toggleLanguage}>
        {t("Switchto")} {i18next.language === "ar" ? t("English") : t("Arabic")}
        {/* Switchto {i18next.language === "ar" ? "English" : "Arabic"} */}
      </button>

      {/* <div className="mt-4">
        <div className="d-flex justify-content-between">
          <span className="text-start">Start</span>
          <span className="text-end">End</span>
        </div>
      </div> */}
    </div>
  );
}
