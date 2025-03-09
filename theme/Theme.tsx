import { useCurrentTheme } from "./shared/currentTheme/CurrentThemeStores";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import { darkThemePalette } from "./shared/palletes/DarkThemePallete";
import { lightThemePalette } from "./shared/palletes/LightThemePallete";
import {
  deskTopTypography,
  mobileTypography,
} from "./shared/typography/Typography";
import useWidthType from "../src/hooks/useWidthType/useWidthType.tsx";

interface themeProps {
  children: React.ReactNode;
}

export const WithTheme = ({ children }: themeProps) => {
  const { isMobile } = useWidthType();
  const { currentTheme } = useCurrentTheme();

  const theme: Theme = createTheme(
    {
      direction: "ltr",
      palette: {
        mode: currentTheme,
        ...(currentTheme === "light" ? lightThemePalette : darkThemePalette),
      },
      typography: isMobile ? mobileTypography : deskTopTypography,
    },
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
