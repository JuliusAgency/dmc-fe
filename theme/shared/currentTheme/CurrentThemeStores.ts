import { create } from "zustand";
import { PaletteMode } from "@mui/material";

interface CurrentThemeStore {
  currentTheme: PaletteMode;
  setLight: () => void;
  setDark: () => void;
  toggleCurrentTheme: () => void;
}

export const useCurrentTheme = create<CurrentThemeStore>((set) => ({
  currentTheme: "light" as PaletteMode,
  setLight: () => set(() => ({ currentTheme: "light" as PaletteMode })),
  setDark: () => set(() => ({ currentTheme: "dark" as PaletteMode })),
  toggleCurrentTheme: () => {
    set((state) => ({
      currentTheme: state.currentTheme === "light" ? "dark" : "light",
    }));
  },
}));
