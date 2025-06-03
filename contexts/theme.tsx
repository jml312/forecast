import { createContext, useContext } from "react";
import { useColorScheme } from "nativewind";
import { theme } from "@/theme";

export const ThemeContext = createContext({
  colorScheme: "",
  getThemeColor: () => "",
  theme: {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export const ThemeProvider = ({ children }) => {
  const { colorScheme } = useColorScheme();
  function getThemeColor(lightValue, darkValue) {
    return colorScheme === "dark" ? darkValue : lightValue;
  }
  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        getThemeColor,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
