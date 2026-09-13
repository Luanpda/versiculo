import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n/translations.js";
import { api } from "../services/api.js";

const LanguageContext = createContext();

const SUPPORTED_LANGS = ["pt", "es", "en"];

function detectInitialLanguage() {
  // 1. Explicit preference previously saved by user
  const stored = localStorage.getItem("palavraLang");
  if (stored && SUPPORTED_LANGS.includes(stored)) {
    return stored;
  }

  // 2. User account profile if logged in
  try {
    const user = JSON.parse(localStorage.getItem("palavraUser") || "{}");
    if (user.language && SUPPORTED_LANGS.includes(user.language)) {
      return user.language;
    }
  } catch (e) {}

  // 3. Browser language & timezone heuristics
  const browserLangs = navigator.languages || [navigator.language || ""];
  for (const bl of browserLangs) {
    const lower = bl.toLowerCase();
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("pt")) return "pt";
    if (lower.startsWith("en")) return "en";
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Sao_Paulo") || tz.includes("Bahia") || tz.includes("Lisbon")) return "pt";
    if (
      tz.includes("Madrid") ||
      tz.includes("Buenos_Aires") ||
      tz.includes("Bogota") ||
      tz.includes("Mexico") ||
      tz.includes("Santiago") ||
      tz.includes("Lima")
    ) {
      return "es";
    }
  } catch (e) {}

  return "pt";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage);

  useEffect(() => {
    // If no manual preference was stored, verify with geo detect API
    if (!localStorage.getItem("palavraLang")) {
      api.detectLanguage()
        .then((res) => {
          if (res?.language && SUPPORTED_LANGS.includes(res.language)) {
            // Only auto-switch if user hasn't clicked a preference in the meantime
            if (!localStorage.getItem("palavraLang")) {
              setLangState(res.language);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  async function changeLanguage(newLang) {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    setLangState(newLang);
    localStorage.setItem("palavraLang", newLang);

    // If logged in, persist to user profile in database
    const token = localStorage.getItem("palavraToken");
    if (token) {
      try {
        await api.updateLanguage(newLang);
        const storedUser = JSON.parse(localStorage.getItem("palavraUser") || "{}");
        storedUser.language = newLang;
        localStorage.setItem("palavraUser", JSON.stringify(storedUser));
      } catch (err) {
        console.warn("Could not save language to profile:", err.message);
      }
    }
  }

  const t = translations[lang] || translations.pt;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageSelector({ className = "" }) {
  const { lang, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  const current = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className={`language-selector-wrap ${className}`}>
      <button
        type="button"
        className="lang-trigger-btn"
        onClick={() => setOpen(!open)}
        aria-label="Selecionar idioma / Select language"
        title="Mudar idioma"
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{current.code.toUpperCase()}</span>
        <span className="lang-caret">▾</span>
      </button>

      {open && (
        <div className="lang-dropdown-menu">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`lang-option ${lang === item.code ? "active" : ""}`}
              onClick={() => {
                changeLanguage(item.code);
                setOpen(false);
              }}
            >
              <span className="lang-flag">{item.flag}</span>
              <span className="lang-label">{item.label}</span>
              {lang === item.code && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
