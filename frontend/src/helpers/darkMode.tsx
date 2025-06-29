import { useEffect, useState } from "react";
import { ThemeContext } from "./darkModeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode
      ? JSON.parse(savedMode)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [locale, setLocale] = useState<string>(() => {
    const savedLang = localStorage.getItem("locale");
    return savedLang === "EN" ? "EN" : "UA";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const changeLocale = (lang: string) => setLocale(lang);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleDarkMode, locale, changeLocale }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
