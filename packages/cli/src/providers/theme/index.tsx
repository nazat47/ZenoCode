import { homedir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_THEME,
  THEMES,
  type Theme,
  type ThemeColors,
} from "../../theme";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createContext, useCallback, useContext, useState } from "react";

const CONFIG_DIR = join(homedir(), ".nightcode");
const THEME_PREFERENCES_PATH = join(CONFIG_DIR, "preferences.json");

type ThemePreferences = {
  themeName: string;
};

function getIinitialTheme(): Theme {
  try {
    const preferences = JSON.parse(
      readFileSync(THEME_PREFERENCES_PATH, { encoding: "utf-8" }),
    ) as Partial<ThemePreferences>;
    const theme = THEMES.find((t) => t.name === preferences.themeName);
    return theme || DEFAULT_THEME;
  } catch (error) {
    return DEFAULT_THEME;
  }
}

function persistTheme(theme: Theme) {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(
      THEME_PREFERENCES_PATH,
      JSON.stringify(
        { themeName: theme.name } satisfies ThemePreferences,
        null,
        2,
      ),
      "utf-8",
    );
  } catch (error) {}
}

type ThemeContextValue = {
  colors: ThemeColors;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getIinitialTheme);

  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    persistTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ colors: currentTheme.colors, currentTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
