import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* =======================
   English translations
======================= */
import enNavbar from "./locales/en/navbar.json";
import enBasket from "./locales/en/basket.json";
import enLogin from "./locales/en/login.json";
import enCart from "./locales/en/cart.json";
import enProduct from "./locales/en/product.json";
import enCommon from "./locales/en/common.json";
import enProfile from "./locales/en/profile.json";
import enRegister from "./locales/en/register.json";
import enUserManagement from "./locales/en/usermanagement.json";
import enOrder from "./locales/en/order.json";
/* =======================
   Arabic translations
======================= */
import arNavbar from "./locales/ar/navbar.json";
import arBasket from "./locales/ar/basket.json";
import arLogin from "./locales/ar/login.json";
import arCart from "./locales/ar/cart.json";
import arProduct from "./locales/ar/product.json";
import arCommon from "./locales/ar/common.json";
import arProfile from "./locales/ar/profile.json";
import arRegister from "./locales/ar/register.json";
import arUserManagement from "./locales/ar/usermanagement.json";
import arOrder from "./locales/ar/order.json";
/* =======================
   Resources
======================= */
const resources = {
  en: {
    navbar: enNavbar,
    basket: enBasket,
    login: enLogin,
    cart: enCart,
    product: enProduct,
    common: enCommon,
    profile: enProfile,
    register: enRegister,
    usermanagement: enUserManagement,
    order:enOrder
  },
  ar: {
    navbar: arNavbar,
    basket: arBasket,
    login: arLogin,
    cart: arCart,
    product: arProduct,
    common: arCommon,
    profile: arProfile,
    register: arRegister,
    usermanagement: arUserManagement,
    order:arOrder
  },
};

/* =======================
   Init i18next
======================= */
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",

    ns: [
      "navbar",
      "basket",
      "login",
      "cart",
      "product",
      "common",
      "profile",
      "register",
      "usermanagement",
      "order"
    ],
    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    debug: false,
  })
  .then(() => {
    console.log("✅ i18next initialized");
     console.log("LANG:", i18n.language);
  console.log("STORE:", i18n.store.data);
  })
  .catch((err) => {
    console.error("❌ i18next init failed", err);
  });

export default i18n;
