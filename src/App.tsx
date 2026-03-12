import Home from './pages/Home'
import { FloatingLinks } from './components/floating-links'
import { Routes, Route } from 'react-router-dom'
import { VideoProvider } from './contexts/video-context'
import { LanguageProvider } from './contexts/language-context'
import { ThemeProvider } from './contexts/theme-context'

function AppContent() {
    return (
        <div className="max-w-6xl mx-4 mt-8 lg:mx-auto">
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-fixed bg-no-repeat opacity-[0.02]"
                style={{ backgroundImage: "url('/wallpaper.png')" }}
            />
            <Routes>
                <Route path="/" element={
                    <main className="flex-auto min-w-0 mt-6 flex flex-col px-8 lg:px-0">
                        <Home />
                        <FloatingLinks />
                    </main>
                } />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <VideoProvider>
                    <AppContent />
                </VideoProvider>
            </LanguageProvider>
        </ThemeProvider>
    )
}

export default App
