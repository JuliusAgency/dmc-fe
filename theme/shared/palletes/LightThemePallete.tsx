import { Palette } from "@mui/material";

export const lightThemePalette: Partial<Palette> = {
  background: {
    default: "#F4F5F7",
    paper: "#f3f1f1",
  },
  primary: {
    main: "#0D4259",
    dark: "#002e41",
    light: "#71a0bb",
    contrastText: "#F4F5F7",
  },
  common: {
    black: "#000B1E",
    white: "#F4F5F7",
  },

  grey: {
    "50": "#f9fafb",
    "100": "#f4f5f7",
    "200": "#e5e7eb",
    "300": "#d2d6dc",
    "400": "#e1e2e3",
    "500": "#c8cacb",
    "600": "#ccced3",
    "700": "#e6e6eb",
    "800": "#b3b7c2",
    "900": "#7f868f",
    A100: "#cfd8dc",
    A200: "#9ea7aa",
    A400: "#607d8b",
    A700: "#455a64",
  },

  secondary: {
    main: "#0089CD",
    contrastText: "#000B1E",
    light: "#51c3f3",
    dark: "#005897",
  },
  //user as accent color
  warning: {
    main: "#EF2024",
    contrastText: "#000B1E",
    light: "#f55b5f",
    dark: "#b30006",
  },
  text: {
    primary: "#010B1F",
    secondary: "#545d72",
    disabled: "#c7c7c7",
  },
};
