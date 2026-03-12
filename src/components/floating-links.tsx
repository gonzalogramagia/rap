import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/theme-context'

export function FloatingLinks() {
    const { theme, toggleTheme } = useTheme()

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
                        <Sun className="w-6 h-6 text-yellow-500 transition-colors" />
                    ) : (
                        <Moon className="w-6 h-6 text-zinc-900 transition-colors" />
                    )}
                </button>
            </div>

            {/* Left Side Buttons - Hidden for now */}
        </>
    )
}
