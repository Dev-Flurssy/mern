// theme/getTheme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

const getTheme = (mode = "light") =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode,
        primary: {
          light: "#5c67a3",
          main: "#3f4771",
          dark: "#2e355b",
          contrastText: "#fff",
        },
        secondary: {
          light: "#ff79b0",
          main: "#ff4081",
          dark: "#c60055",
          contrastText: "#000",
        },
        background: {
          default: mode === "light" ? "#f5f5f5" : "#121212",
          paper: mode === "light" ? "#ffffff" : "#1e1e1e",
        },
        text: {
          primary: mode === "light" ? "#212121" : "#ffffff",
          secondary: mode === "light" ? "#757575" : "#b0bec5",
        },
        success: {
          main: "#4caf50",
        },
        error: {
          main: "#f44336",
        },
        warning: {
          main: "#ff9800",
        },
        openTitle: "#3f4771",
        protectedTitle: pink[400],
      },
      typography: {
        fontFamily: "Roboto, sans-serif",
        h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
        h2: { fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: "none",
            },
          },
        },
      },
    })
  );

export default getTheme;
