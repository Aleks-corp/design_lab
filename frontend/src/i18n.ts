import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "./i18n/EN.json";
import UA from "./i18n/UA.json";

i18n.use(initReactI18next).init({
  resources: {
    EN: { translation: EN },
    UA: { translation: UA },
  },
  lng: localStorage.getItem("locale") || "EN",
  fallbackLng: "EN",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
