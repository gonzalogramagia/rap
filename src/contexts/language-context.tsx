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
      searchPlaceholder: "Buscar rap...",
      noResultsFor: "No se encontraron resultados para",
      headline_part1: "Encuentra canciones, batallas o charlas de rap",
      headline_part2: "¡al instante!",
      tag_Batalla: "Batalla",
      tag_FMS: "FMS",
      tag_Canción: "Canción",
      tag_Charla: "Charla",
    },
    en: {
      searchPlaceholder: "Search rap...",
      noResultsFor: "No results for",
      headline_part1: "Find rap songs, battles or talks",
      headline_part2: "instantly!",
      tag_Batalla: "Battle",
      tag_FMS: "FMS",
      tag_Canción: "Song",
      tag_Charla: "Talk",
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
    const title = "Goalritmo 🎵 Rap Lyrics";
    const description = "Plataforma premium de letras de rap, batallas y charlas. Gestiona tu contenido y conecta con tu audiencia.";
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
