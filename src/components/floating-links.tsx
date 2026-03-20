import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/theme-context'
import { useLanguage } from '../contexts/language-context'

export function FloatingLinks() {
    const { theme, toggleTheme } = useTheme()
    const { language, setLanguage } = useLanguage()

    return (
        <>
            {/* Right Side Buttons: Dark Mode / Github Toggle */}
            <div className="fixed bottom-8 right-8 flex gap-3 z-[110]">
                <button
                    onClick={toggleTheme}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label="Toggle Dark Mode"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? (
                        <Sun className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:text-[#FACD00] transition-colors`} />
                    ) : (
                        <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:text-[#FACD00] transition-colors`} />
                    )}
                </button>
            </div>

            {/* Left Side Buttons: Language Toggle */}
            <div className="fixed bottom-8 left-8 flex gap-3 z-[110]">
                <button
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label="Toggle Language"
                    title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                >
                    <div className={`w-6 h-6 flex items-center justify-center font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:text-[#FACD00] transition-colors tracking-tighter`}>
                        {language === 'es' ? 'EN' : 'ES'}
                    </div>
                </button>
            </div>
        </>
    )
}
