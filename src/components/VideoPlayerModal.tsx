import {
  X,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Video } from "../contexts/video-context";
import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../contexts/language-context";

interface VideoPlayerModalProps {
  video: Video;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function VideoPlayerModal({
  video,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: VideoPlayerModalProps) {
  const { language } = useLanguage();
  const [lyricsSearch, setLyricsSearch] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const playlistId = "PLLswL1pDm9IxcKcBy5MbMFljNnQs2WVx8";

  const getVideoUrlWithPlaylist = (url: string) => {
    if (!url) return "";

    try {
      const parsed = new URL(url);
      if (!parsed.searchParams.get("list")) {
        parsed.searchParams.set("list", playlistId);
      }
      return parsed.toString();
    } catch {
      return url.includes("?")
        ? `${url}&list=${playlistId}`
        : `${url}?list=${playlistId}`;
    }
  };

  const openInYoutubePlaylist = () => {
    const finalUrl = getVideoUrlWithPlaylist(video.url);
    if (!finalUrl) return;
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  // Initial search sync from home search
  useEffect(() => {
    const savedSearch = localStorage.getItem("last-global-search") || "";
    if (
      savedSearch &&
      video.lyrics?.toLowerCase().includes(savedSearch.toLowerCase())
    ) {
      setLyricsSearch(savedSearch);
      setCurrentMatchIndex(0);

      // Auto-scroll to first match when opening from search
      setTimeout(() => {
        const element = document.getElementById("match-0");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [video.id, video.lyrics]);

  if (!video.embedUrl) return null;

  // Reset index when search changes
  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [lyricsSearch]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const matchesCount = useMemo(() => {
    if (!video.lyrics || !lyricsSearch.trim()) return 0;
    const regex = new RegExp(lyricsSearch, "gi");
    const matches = video.lyrics.match(regex);
    return matches ? matches.length : 0;
  }, [video.lyrics, lyricsSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && matchesCount > 0) {
      e.preventDefault();
      const nextIndex = e.shiftKey
        ? (currentMatchIndex - 1 + matchesCount) % matchesCount
        : (currentMatchIndex + 1) % matchesCount;
      setCurrentMatchIndex(nextIndex);

      // Scroll to the next match
      setTimeout(() => {
        const element = document.getElementById(`match-${nextIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  };

  const highlightedLyrics = useMemo(() => {
    if (!video.lyrics) return null;

    const lines = video.lyrics.split("\n");
    const hasBilingualLines = lines.some((line) => line.includes(" || "));

    if (hasBilingualLines) {
      return (
        <>
          {lines.map((line, i) => {
            if (!line.trim()) return <br key={`br-${i}`} />;

            if (!line.includes(" || ")) {
              return (
                <span key={`line-${i}`} className="block opacity-80">
                  {line}
                </span>
              );
            }

            const [enRaw, esRaw] = line.split(" || ");
            const en = enRaw?.trim() ?? "";
            const es = esRaw?.trim() ?? "";

            const primary = language === "en" ? en : es;
            const secondary = language === "en" ? es : en;

            return (
              <span key={`line-${i}`} className="block mb-1">
                <span className="font-semibold text-[#FACD00]">{primary}</span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  {"  ·  "}
                </span>
                <span className="opacity-70">{secondary}</span>
              </span>
            );
          })}
        </>
      );
    }

    if (!lyricsSearch.trim()) return video.lyrics;

    const parts = video.lyrics.split(new RegExp(`(${lyricsSearch})`, "gi"));
    let matchCounter = -1;

    return (
      <>
        {parts.map((part, i) => {
          const isMatch = part.toLowerCase() === lyricsSearch.toLowerCase();
          if (isMatch) matchCounter++;
          const isCurrent = isMatch && matchCounter === currentMatchIndex;

          return isMatch ? (
            <mark
              key={i}
              id={`match-${matchCounter}`}
              className={`rounded-sm px-0.5 transition-colors duration-200 ${
                isCurrent
                  ? "bg-yellow-400 text-black z-10 shadow-sm outline-2 outline-yellow-500"
                  : "bg-[#48D1CC] text-black/80"
              }`}
            >
              {part}
            </mark>
          ) : (
            part
          );
        })}
      </>
    );
  }, [video.lyrics, lyricsSearch, currentMatchIndex]);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white transition-all duration-100 ease-out cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-black/75 enabled:hover:text-[#FACD00] enabled:hover:scale-105"
          title="Sesión anterior"
          aria-label="Sesión anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white transition-all duration-100 ease-out cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-black/75 enabled:hover:text-[#FACD00] enabled:hover:scale-105"
          title="Siguiente sesión"
          aria-label="Siguiente sesión"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-6xl bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 h-[92vh] md:h-[80vh] flex flex-col md:flex-row">
          {/* Video Section (Left/Top) */}
          <div className="relative bg-black h-[34vh] sm:h-[36vh] md:h-auto md:min-h-0 md:flex-1 shrink-0">
            <iframe
              src={`${video.embedUrl}?autoplay=1`}
              title={video.name}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Popcorn emoji for big screens */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-4xl pointer-events-none hidden lg:flex items-center justify-center select-none opacity-80 z-20">
              <span className="animate-sway">🍿</span>
            </div>
          </div>

          {/* Lyrics Section (Right) */}
          <div className="w-full md:w-[380px] lg:w-[450px] flex flex-col flex-1 min-h-0 md:flex-none bg-white dark:bg-zinc-950 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-zinc-800 shrink-0 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-neutral-900 dark:text-neutral-50 transition-all duration-100 ease-out cursor-pointer bg-transparent hover:bg-[#48D1CC]/20 hover:text-[#48D1CC] dark:hover:bg-[#48D1CC]/20 dark:hover:text-[#48D1CC] hover:shadow-md active:scale-90"
            >
              <X className="w-6 h-6 transition-colors" />
            </button>

            {video.lyrics ? (
              <>
                <div className="px-6 pt-6 pb-2 md:px-10">
                  <button
                    type="button"
                    onClick={openInYoutubePlaylist}
                    className="text-left w-full font-bold text-neutral-900 dark:text-neutral-100 hover:text-[#48D1CC] transition-colors cursor-pointer"
                    title="Abrir en YouTube (playlist)"
                  >
                    {video.name}
                  </button>
                </div>
                <div
                  ref={lyricsContainerRef}
                  className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 md:px-10 pt-2 pb-4 md:pb-10 scrollbar-hide scroll-smooth"
                >
                  <pre className="whitespace-pre-line font-sans leading-relaxed text-lg font-medium text-neutral-900 dark:text-neutral-50">
                    {highlightedLyrics}
                  </pre>
                </div>

                {/* Internal Search (Bottom Right) */}
                <div className="p-4 sm:p-5 md:p-6 bg-white dark:bg-zinc-950 border-t border-neutral-100 dark:border-zinc-800">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar en la letra... (Enter para saltar)"
                      value={lyricsSearch}
                      onChange={(e) => setLyricsSearch(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full pl-9 pr-24 py-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#48D1CC]/50 transition-all text-neutral-900 dark:text-neutral-100"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {matchesCount > 0 && (
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                          {currentMatchIndex + 1}/{matchesCount}
                        </span>
                      )}
                      {lyricsSearch && (
                        <button
                          onClick={() => setLyricsSearch("")}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-zinc-700 rounded-md text-neutral-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <button
                  type="button"
                  onClick={openInYoutubePlaylist}
                  className="font-bold text-neutral-800 dark:text-neutral-100 hover:text-[#48D1CC] transition-colors cursor-pointer"
                  title="Abrir en YouTube (playlist)"
                >
                  {video.name}
                </button>
                <div className="text-xl font-bold text-neutral-400 dark:text-zinc-600 animate-occasional-bounce select-none">
                  Letra en proceso...
                </div>
                <div className="w-12 h-1 bg-[#FACD00]/20 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
