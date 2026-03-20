import Home from "./pages/Home";
import { FloatingLinks } from "./components/floating-links";
import { Routes, Route } from "react-router-dom";
import { VideoProvider } from "./contexts/video-context";
import { LanguageProvider } from "./contexts/language-context";
import { ThemeProvider, useTheme } from "./contexts/theme-context";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className="relative isolate min-h-screen">
      <div
        className={`fixed inset-0 z-0 pointer-events-none ${theme === "dark" ? "app-bg-dark opacity-100" : "opacity-0"}`}
      />
      <div
        className={`fixed inset-0 z-0 pointer-events-none ${theme === "light" ? "app-bg-waves opacity-100" : "opacity-0"}`}
      />
      <div
        className={`fixed inset-0 z-[1] pointer-events-none bg-cover bg-center bg-fixed bg-no-repeat ${theme === "dark" ? "opacity-[0.14]" : "opacity-0"}`}
        style={{ backgroundImage: "url('/wallpaper.png')" }}
      />
      <div className="relative z-10 max-w-6xl mx-4 mt-8 lg:mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <main className="flex-auto min-w-0 mt-6 flex flex-col px-8 lg:px-0">
                <Home />
                <FloatingLinks />
              </main>
            }
          />
        </Routes>
        <footer className="pb-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <a
            href="https://www.bizarrap.com/bzrp"
            className="hover:text-[#FACD00] transition-colors"
          >
            Averiguá bien 👀
          </a>
        </footer>
      </div>
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
  );
}

export default App;
