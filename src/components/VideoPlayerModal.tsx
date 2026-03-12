import { X, Search as SearchIcon } from 'lucide-react';
import { Video } from '../contexts/video-context';
import { useEffect, useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

interface VideoPlayerModalProps {
    video: Video;
    onClose: () => void;
}

export default function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
    const [lyricsSearch, setLyricsSearch] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    // Initial search sync from home search
    useEffect(() => {
        const savedSearch = localStorage.getItem('last-global-search') || '';
        if (savedSearch && video.lyrics?.toLowerCase().includes(savedSearch.toLowerCase())) {
            setLyricsSearch(savedSearch);
            setCurrentMatchIndex(0);

            // Auto-scroll to first match when opening from search
            setTimeout(() => {
                const element = document.getElementById('match-0');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const matchesCount = useMemo(() => {
        if (!video.lyrics || !lyricsSearch.trim()) return 0;
        const regex = new RegExp(lyricsSearch, 'gi');
        const matches = video.lyrics.match(regex);
        return matches ? matches.length : 0;
    }, [video.lyrics, lyricsSearch]);

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && matchesCount > 0) {
            e.preventDefault();
            const nextIndex = e.shiftKey
                ? (currentMatchIndex - 1 + matchesCount) % matchesCount
                : (currentMatchIndex + 1) % matchesCount;
            setCurrentMatchIndex(nextIndex);

            // Scroll to the next match
            setTimeout(() => {
                const element = document.getElementById(`match-${nextIndex}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 0);
        }
    };

    const highlightedLyrics = useMemo(() => {
        if (!video.lyrics) return null;
        if (!lyricsSearch.trim()) return video.lyrics;

        const parts = video.lyrics.split(new RegExp(`(${lyricsSearch})`, 'gi'));
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
                            className={`rounded-sm px-0.5 transition-colors duration-200 ${isCurrent
                                ? 'bg-yellow-400 text-black z-10 shadow-sm outline-2 outline-yellow-500'
                                : 'bg-[#48D1CC] text-black/80'
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="relative w-full max-w-6xl bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 h-[90vh] md:h-[80vh] flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                {/* Video Section (Left/Top) */}
                <div className="relative flex-1 bg-black min-h-[300px] md:min-h-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-all duration-300 cursor-pointer md:hidden hover:rotate-90 active:scale-90 group"
                    >
                        <X className="w-6 h-6 group-hover:text-[#48D1CC]" />
                    </button>
                    <iframe
                        src={`${video.embedUrl}?autoplay=1`}
                        title={video.name}
                        className="w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Lyrics Section (Right) */}
                <div className="w-full md:w-[380px] lg:w-[450px] flex flex-col bg-white dark:bg-zinc-950 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-zinc-800 shrink-0 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full text-neutral-900 dark:text-neutral-50 transition-all duration-300 cursor-pointer hover:rotate-90 active:scale-90 group"
                    >
                        <X className="w-6 h-6 group-hover:text-[#48D1CC] transition-colors" />
                    </button>

                    {video.lyrics ? (
                        <>
                            <div
                                ref={lyricsContainerRef}
                                className="flex-1 overflow-y-auto p-1/2 md:p-10 pt-16 md:pt-16 scrollbar-hide scroll-smooth"
                            >
                                <pre className="whitespace-pre-line font-sans leading-relaxed text-lg font-medium text-neutral-900 dark:text-neutral-50">
                                    {highlightedLyrics}
                                </pre>
                            </div>

                            {/* Internal Search (Bottom Right) */}
                            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-neutral-100 dark:border-zinc-800">
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
                                                onClick={() => setLyricsSearch('')}
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
                        <div className="flex-1 flex items-center justify-center p-6 text-neutral-900 dark:text-neutral-50 text-sm font-medium">
                            No hay letra disponible
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

