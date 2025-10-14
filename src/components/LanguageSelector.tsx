import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setLanguage } from "../features/languageSlice";

export default function LanguageSelector() {
  const dispatch = useAppDispatch();
  const { lang } = useAppSelector((state) => state.language);

  const handleChange = (newLang: string) => {
    dispatch(setLanguage(newLang));
    window.location.reload(); // reload page to apply new backend language
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span>Language: </span>
      <button
        onClick={() => handleChange("en")}
        disabled={lang === "en"}
      >
        English
      </button>
      <button
        onClick={() => handleChange("ar")}
        disabled={lang === "ar"}
        style={{ marginLeft: "0.5rem" }}
      >
        Arabic
      </button>
    </div>
  );
}
