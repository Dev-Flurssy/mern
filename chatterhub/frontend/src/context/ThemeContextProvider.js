import { useState, useMemo, createContext, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "../theme"; // Make sure this returns a valid MUI theme object

export const ThemeMode = createContext({
  mode: "light",
  toggleTheme: () => {},
});

const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeMode.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeMode.Provider>
  );
};

export default ThemeContextProvider;
