// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import files individually to catch errors
let enNavbar, enBasket, enLogin, enCart, enProduct, enCommon, enProfile, enRegister, enUserManagement;
let arNavbar, arBasket, arLogin, arCart, arProduct, arCommon, arProfile, arRegister, arUserManagement;



// Load English translations

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
    usermanagement: enUserManagement
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
    usermanagement: arUserManagement
  }
};

console.log('Final resources structure:', JSON.stringify(resources, null, 2));

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['navbar', 'basket', 'login', 'cart', 'product', 'common', 'profile', 'register', 'usermanagement'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: false,
  })
  .then(() => {
    console.log('✅ i18next initialized successfully');
  })
  .catch((error) => {
    console.error('❌ i18next initialization failed:', error);
  });

export default i18n;