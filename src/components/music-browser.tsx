import { useState, useMemo } from "react";
import { useVideos, Video } from "../contexts/video-context";
import { useLanguage } from "../contexts/language-context";
import VideoPlayerModal from "./VideoPlayerModal";
import { Search, SearchX, Play, ArrowLeftRight } from 'lucide-react';
import { useTheme } from "../contexts/theme-context";

function VideoItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="group bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden hover:shadow-xl dark:hover:shadow-[#48D1CC]/10 transition-all relative">
            {children}
        </div>
    );
}

export function MusicBrowser() {
    const { theme } = useTheme();
    const { videos } = useVideos();
    const { t, language } = useLanguage();
    const playlistUrl = 'https://www.youtube.com/playlist?list=PLLswL1pDm9IxcKcBy5MbMFljNnQs2WVx8';

    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Filter tags to show only those present in the current videos
    /*
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        videos.forEach(video => {
            video.tags.forEach(tag => tags.add(tag));
        });

        return Array.from(tags).sort((a, b) => {
            if (a === 'Canción') return -1;
            if (b === 'Canción') return 1;
            if (a === 'Batalla') return -1;
            if (b === 'Batalla') return 1;
            if (a === 'FMS') return -1;
            if (b === 'FMS') return 1;
            return a.localeCompare(b);
        });
    }, [videos]);
    */

    // Filter and sort videos based on search, active tag, and sort order
    const filteredVideos = useMemo(() => {
        let result = videos;

        if (activeTag) {
            result = result.filter(video => video.tags.includes(activeTag));
        }

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(video =>
                video.name.toLowerCase().includes(lowerSearch) ||
                video.tags.some(tag => tag.toLowerCase().includes(lowerSearch)) ||
                (video.lyrics && video.lyrics.toLowerCase().includes(lowerSearch))
            );
        }

        return [...result].sort((a, b) => {
            const numA = parseInt(a.id.split('-')[1]) || 0;
            const numB = parseInt(b.id.split('-')[1]) || 0;
            return sortOrder === "asc" ? numA - numB : numB - numA;
        });
    }, [videos, search, activeTag, sortOrder]);

    const getLyricSnippet = (video: Video, searchTerm: string) => {
        const lyrics = video.lyrics;
        if (!lyrics || !searchTerm.trim()) return null;
        const index = lyrics.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (index === -1) return null;

        const start = Math.max(0, index - 30);
        const end = Math.min(lyrics.length, index + searchTerm.length + 40);
        let snippet = lyrics.substring(start, end);

        if (start > 0) snippet = '...' + snippet;
        if (end < lyrics.length) snippet = snippet + '...';

        const parts = snippet.split(new RegExp(`(${searchTerm})`, 'gi'));

        return (
            <div
                className="mt-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400 italic line-clamp-2 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    localStorage.setItem('last-global-search', searchTerm.trim());
                    setPlayingVideo(video);
                }}
            >
                {parts.map((part, i) =>
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <span key={i} className="bg-yellow-300 dark:bg-yellow-400 text-black rounded-sm px-1 not-italic font-bold shadow-sm">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </div>
        );
    };

    /*
    const getTagName = (tag: string) => {
        const key = 'tag_' + tag;
        const translation = t(key);
        return translation === key ? tag : translation;
    };
    */

    return (
        <div className="space-y-4 md:space-y-8 overflow-x-clip">
            <div className="flex flex-col md:flex-row items-center justify-center pt-0 pb-0 md:pt-0 md:pb-0 gap-0 md:gap-1 max-w-4xl mx-auto">
                <img
                    src="/goalritmo.png"
                    alt="66oalritmo Logo"
                    onClick={() => window.open('https://youtu.be/xrDZpAq2w7g', '_blank')}
                    className="cursor-pointer h-64 md:h-80 w-auto object-contain hover:scale-110 hover:brightness-110 transition-all duration-500 -mt-8 -mb-4 md:mt-0 md:mb-0"
                    style={{
                        filter: 'drop-shadow(0 0 50px rgba(250, 204, 21, 0.25))'
                    }}
                />
                <div className="flex flex-col items-center md:items-start md:gap-0">
                    <h1 className="mx-auto md:mx-0 md:max-w-xl text-3xl md:text-5xl font-extrabold text-center md:text-left text-neutral-900 dark:text-white leading-tight tracking-tight">
                        <>
                            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-cyan-200' : 'from-neutral-900 to-neutral-600'} block whitespace-pre-line drop-shadow-sm`}>
                                {t('headline_part1')}
                            </span>
                            <span
                                className="text-[#48D1CC] block cursor-pointer hover:brightness-110 transition"
                                onClick={() => window.open(playlistUrl, '_blank', 'noopener,noreferrer')}
                                title="Abrir playlist en YouTube"
                            >
                                {language === 'en' ? 'The 66' : 'Las 66'}
                            </span>
                        </>
                    </h1>
                </div>
            </div>

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white dark:bg-[#0a0a0a] py-2 md:py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => {
                                if (activeTag) setActiveTag(null);
                            }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FACD00] transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                        />
                    </div>
                    <button
                        onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-zinc-900 hover:border-[#FACD00] transition-all text-neutral-900 dark:text-neutral-100 cursor-pointer"
                        title={sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"}
                    >
                        <span className="text-sm font-bold">
                            {sortOrder === "asc" ? "00" : "66"}
                        </span>
                        <ArrowLeftRight className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:text-[#FACD00] transition-all duration-300 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                        <span className="text-sm font-bold">
                            {sortOrder === "asc" ? "66" : "00"}
                        </span>
                    </button>
                </div>

                {/* Tag Cloud - Removed for now */}
            </div>

            {/* Video Grid */}
            <div
                key={`${sortOrder}-${search}`}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20 pb-10"
            >
                {filteredVideos.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500 space-y-4">
                        <div className="bg-neutral-100 dark:bg-zinc-900 p-4 rounded-full">
                            <SearchX className="w-8 h-8 text-neutral-400" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 text-lg">{t('noResultsFor')}</p>
                            <p className="text-xl text-neutral-400">"{search}"</p>
                        </div>
                    </div>
                )}

                {filteredVideos.map((video, index) => {
                    const isSpecial = video.id === 'bzrp-23';
                    return (
                        <div
                            key={video.id}
                            className={`animate-bzrp-appear ${isSpecial ? 'bzrp-session-highlight' : ''}`}
                            style={{ animationDelay: `${Math.min(index * 50, 600)}ms` }}
                        >
                            <VideoItem>
                                <div className="aspect-video bg-gray-100 dark:bg-zinc-800 relative group-hover:scale-105 transition-transform duration-500">
                                    {video.url ? (
                                        <div
                                            onClick={() => setPlayingVideo(video)}
                                            className="block w-full h-full relative cursor-pointer"
                                        >
                                            <img
                                                src={`https://img.youtube.com/vi/${video.url.split('v=')[1]?.split('&')[0] || video.url.split('youtu.be/')[1]?.split('?')[0]}/hqdefault.jpg`}
                                                alt={video.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                                                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-zinc-900 text-neutral-400 p-4">
                                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center mb-3">
                                                <Play className="w-6 h-6 opacity-30" />
                                            </div>
                                            <span className="text-sm font-bold tracking-wider uppercase opacity-50">Próximamente</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3
                                        className={`font-bold text-neutral-900 dark:text-neutral-100 text-base leading-snug transition-colors cursor-pointer line-clamp-2 min-h-[3rem] ${isSpecial ? 'group-hover:text-white' : 'group-hover:text-[#48D1CC]'}`}
                                        title={video.name}
                                        onClick={() => {
                                            if (video.url) {
                                                if (search.trim()) {
                                                    localStorage.setItem('last-global-search', search.trim());
                                                } else {
                                                    localStorage.removeItem('last-global-search');
                                                }
                                                setPlayingVideo(video);
                                            }
                                        }}
                                    >
                                        {video.name}
                                    </h3>
                                    {search.trim() && getLyricSnippet(video, search)}
                                    {/* Tags removed for now */}
                                </div>
                            </VideoItem>
                        </div>
                    );
                })}
            </div>

            {playingVideo && (
                <VideoPlayerModal
                    video={playingVideo}
                    onClose={() => setPlayingVideo(null)}
                />
            )}
        </div>
    );
}
