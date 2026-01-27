
// src/testTranslations.js
import enNavbar from './locales/en/navbar.json';
import enBasket from './locales/en/basket.json';
import enLogin from './locales/en/login.json';
import enCart from './locales/en/cart.json';
import enProduct from './locales/en/product.json';
import enCommon from './locales/en/common.json';
import enProfile from './locales/en/profile.json';
import enRegister from './locales/en/register.json';
import enUserManagement from './locales/en/usermanagement.json';

import arNavbar from './locales/ar/navbar.json';
import arBasket from './locales/ar/basket.json';
import arLogin from './locales/ar/login.json';
import arCart from './locales/ar/cart.json';
import arProduct from './locales/ar/product.json';
import arCommon from './locales/ar/common.json';
import arProfile from './locales/ar/profile.json';
import arRegister from './locales/ar/register.json';
import arUserManagement from './locales/ar/usermanagement.json';

const files = {
  enNavbar, enBasket, enLogin, enCart, enProduct, enCommon, enProfile, enRegister, enUserManagement,
  arNavbar, arBasket, arLogin, arCart, arProduct, arCommon, arProfile, arRegister, arUserManagement
};

Object.entries(files).forEach(([name, content]) => {
  console.log(`\n${name}:`, {
    type: typeof content,
    isArray: Array.isArray(content),
    isObject: typeof content === 'object' && !Array.isArray(content),
    keys: content ? Object.keys(content) : 'null/undefined',
    value: content
  });
});