import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useThemeMode from "../hooks/useTheme";

const ThemeToggleButton = () => {
  const theme = useTheme();
  const { toggleTheme } = useThemeMode();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggleButton;
