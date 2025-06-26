import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";
import { useEffect } from "react";
import DropdownEmpty from "../DropdownEmpty";
import styles from "./LangSwitcher.module.sass";

export function LanguageSwitcher() {
  const { locale, changeLocale } = useTheme();
  const { i18n } = useTranslation();
  const langListOptions = ["EN", "UA"];

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  return (
    <DropdownEmpty
      className={styles.droplang}
      value={locale}
      setValue={changeLocale}
      options={langListOptions}
    />
  );
}
