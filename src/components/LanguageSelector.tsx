import { useTranslation } from "react-i18next";
import { Button, Container } from "react-bootstrap";

export default function LangSelector() {
  const { i18n, t } = useTranslation("navbar");

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const isArabic = i18n.language === "ar";

  return (
    <Container className="container">
      <Button className="btn btn-primary" size="sm" onClick={toggleLanguage}>
        {t("Switchto")} {isArabic ? t("English") : t("Arabic")}
      </Button>
    </Container>
  );
}