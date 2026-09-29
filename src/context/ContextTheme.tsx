import { createContext, ReactNode, useContext, useState } from "react";

export type Theme = {
    name: string;
    isDark: boolean;
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    border: string;
    headerBackground: string;
    headerText: string;
};

export const themes: Theme[] = [
  //Light themes 
  {
    name: "White",
    isDark: false,
    background: "#ffffff",
    card: "#f3f4f6",
    text: "#111111",
    subtext: "#6b7280",
    primary: "#374151",
    border: "#e5e7eb",
    headerBackground: "#f0f0f0",
    headerText: "#111111",
  },
  {
    name: "Green",
    isDark: false,
    background: "#effaf3",
    card: "#ffffff",
    text: "#0b2a1a",
    subtext: "#4b7a5f",
    primary: "#16a34a",
    border: "#c6ead3",
    headerBackground: "#16a34a",
    headerText: "#ffffff",
  },
  {
    name: "Blue",
    isDark: false,
    background: "#eef5ff",
    card: "#ffffff",
    text: "#0b1f3a",
    subtext: "#54708f",
    primary: "#2563eb",
    border: "#c9dcf7",
    headerBackground: "#2563eb",
    headerText: "#ffffff",
  },
 
  //Dark themes
  {
    name: "Black",
    isDark: true,
    background: "#000000",
    card: "#1c1c1e",
    text: "#ffffff",
    subtext: "#9ca3af",
    primary: "#e5e7eb",
    border: "#2c2c2e",
    headerBackground: "#111111",
    headerText: "#ffffff",
  },
  {
    name: "Purple",
    isDark: true,
    background: "#1a0b2e",
    card: "#2a1547",
    text: "#f3e8ff",
    subtext: "#b79ad6",
    primary: "#a855f7",
    border: "#42236b",
    headerBackground: "#4c1d95",
    headerText: "#ffffff",
  },
  {
    name: "Red",
    isDark: true,
    background: "#1f0a0a",
    card: "#331313",
    text: "#ffeaea",
    subtext: "#c99494",
    primary: "#ef4444",
    border: "#521c1c",
    headerBackground: "#991b1b",
    headerText: "#ffffff",
  },
];

type ThemeContextValue = {
  theme: Theme;
  setThemeByName: (name: string) => void;
};
 
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
 
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(themes[0]);
 
  const setThemeByName = (name: string) => {
    const found = themes.find((t) => t.name === name);
    if (found) setTheme(found);
  };
 
  return (
    <ThemeContext.Provider value={{ theme, setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  );
}
 
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return ctx;
}