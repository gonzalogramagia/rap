import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    // Force Spanish as primary for goalritmo.com
    setLanguage("es");
  }, []);

  const translations: Record<Language, Record<string, string>> = {
    es: {
      searchPlaceholder: "Buscar sesiones o letras...",
      noResultsFor: "No se encontraron sesiones para",
      headline_part1: "Bizarrap Music Sessions",
      headline_part2: "Las 66 Sesiones",
      tag_Session: "Sesión",
      tag_BZRP: "BZRP",
      tag_Music: "Música",
    },
    en: {
      searchPlaceholder: "Search sessions or lyrics...",
      noResultsFor: "No sessions found for",
      headline_part1: "Bizarrap Music Sessions",
      headline_part2: "The 66 Sessions",
      tag_Session: "Session",
      tag_BZRP: "BZRP",
      tag_Music: "Music",
    },
  };

  const t = useCallback(
    (key: string) => {
      const base = translations[language] || {};
      return base[key] || key;
    },
    [language]
  );

  useEffect(() => {
    const title = "🎵";
    const description = "Colección exclusiva de las 66 Bizarrap Music Sessions con letras sincronizadas y búsqueda inteligente.";
    const fullImageUrl = `https://goalritmo.com/goalritmo.png`;
    const siteUrl = "https://goalritmo.com";

    document.title = title;

    const updateMeta = (
      selector: string,
      content: string,
      attr: string = "content"
    ) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, content);
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:url"]', siteUrl);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', fullImageUrl);
    updateMeta('meta[property="twitter:url"]', siteUrl);
    updateMeta('meta[property="twitter:title"]', title);
    updateMeta('meta[property="twitter:description"]', description);
    updateMeta('meta[property="twitter:image"]', fullImageUrl);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
