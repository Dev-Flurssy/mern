import { useContext } from "react";
import { ThemeMode } from "../context/ThemeContextProvider.js";

const useThemeMode = () => {
  const context = useContext(ThemeMode);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeContextProvider");
  }
  return context;
};

export default useThemeMode;
