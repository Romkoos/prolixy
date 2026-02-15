import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const THEME_STORAGE_KEY = "prolixy.theme";
const LANGUAGE_STORAGE_KEY = "prolixy.language";

type ThemeMode = "light" | "dark";
type AppLanguage = "en" | "ru";

interface PreferencesContextValue {
  themeMode: ThemeMode;
  language: AppLanguage;
  toggleTheme: () => void;
  setLanguage: (language: AppLanguage) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const getStoredThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

const getStoredLanguage = (): AppLanguage => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "ru" ? "ru" : "en";
};

/**
 * Provides UI preferences (theme and language) with persistence.
 */
export const PreferencesProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { i18n } = useTranslation();
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode());
  const [language, setLanguageState] = useState<AppLanguage>(() => getStoredLanguage());

  const toggleTheme = (): void => {
    setThemeMode((current) => {
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  };

  const setLanguage = (nextLanguage: AppLanguage): void => {
    setLanguageState(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [i18n, language]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      themeMode,
      language,
      toggleTheme,
      setLanguage
    }),
    [language, themeMode]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

/**
 * Returns the current preferences context.
 */
export const usePreferences = (): PreferencesContextValue => {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("usePreferences must be used within PreferencesProvider.");
  }
  return value;
};
