
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useBootstrapDirection } from "./useBootstrapDirection";
import { Button, Container } from "react-bootstrap";

export default function LangSelector() {
  const { i18n, t } = useTranslation("navbar");
  useBootstrapDirection();

  const toggleLanguage = () => {
    const newLang = i18next.language === "ar" ? "en" : "ar";
    i18next.changeLanguage(newLang);
  };

  return (
    <Container className="container"   >
      <Button className="btn btn-primary" size="sm" onClick={toggleLanguage}>
        {t("Switchto")} {i18next.language === "ar" ? t("English") : t("Arabic")}
       
      </Button>

   
    </Container>
  );
}
