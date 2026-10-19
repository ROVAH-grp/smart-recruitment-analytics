import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
export type Density = "rich" | "simple";

interface ThemeContextValue {
  theme: Theme;
  density: Density;
  toggleTheme: () => void;
  toggleDensity: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "recruitflow-theme";
const DENSITY_KEY = "recruitflow-density";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialDensity(): Density {
  if (typeof window === "undefined") return "rich";
  const stored = window.localStorage.getItem(DENSITY_KEY);
  return stored === "simple" ? "simple" : "rich";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [density, setDensity] = useState<Density>(getInitialDensity);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { window.localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("simple", density === "simple");
    try { window.localStorage.setItem(DENSITY_KEY, density); } catch { /* ignore */ }
  }, [density]);

  const value: ThemeContextValue = {
    theme,
    density,
    toggleTheme: () => setTheme(t => (t === "light" ? "dark" : "light")),
    toggleDensity: () => setDensity(d => (d === "rich" ? "simple" : "rich")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
